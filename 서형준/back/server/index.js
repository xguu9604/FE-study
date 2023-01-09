// express 모듈을 불러오기
const express = require('express')
// express 모듈을 통해 앱을 생성
const app = express()
// port 주소를 지정 : 맘대로 지정 가능
const port = 5000
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

const config = require('./config/key')

const { auth } = require("./middleware/auth")
const { User } = require("./models/User")

// application/x-www-form-urlencoded 로 주어지는 데이터 분석
app.use(bodyParser.urlencoded({extended: true}))

// application/json 타입의 데이터 분석
app.use(bodyParser.json())

// cookie-parser 사용하기
app.use(cookieParser())

// db 연결해주기
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {})
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err))


// 루트 디렉토리의 기준을 알려주기
app.get('/', (req, res) => {
  res.send('Hello World! 여기다! 바뀜?')
})

app.post('/api/users/register', (req, res) => {
    // 회원가입시 필요한 정보를 받고 db에 넣어주기
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true,
        })
    })
})

app.post('/api/users/login', (req, res) => {
  // 요청된 이메일이 db에 있는지 확인
  User.findOne({ email: req.body.email }, (err, userInfo) => {
    if (!userInfo) {
      return res.json({
        loginSuccess: false,
        message: "해당 이메일에 맞는 유저가 없습니다.",
      })
    }

    // 요청된 이메일이 있다면 비밀번호 확인
    userInfo.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})

      // 비번도 일치하면 토큰 생성하기
      userInfo.generateToken((err, user) => {
        if (err) return res.status(400).send(err)

        // 토큰 저장하기
        res.cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id })
      })

    })
  })
})


app.get('/api/users/auth', auth, (req, res) => {

  // 미들웨어 통과 했다면 인증이 되었다는 의미
  res.status(200).json({
    _id: req.user._id,
    // role = 0이면 일반 유저 
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  })
})


app.get('/api/users/logout', auth, (req, res) => {

  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).send({
      success: true
    })
  })
})


app.get('/api/hello', (req, res) => {

  res.send("하이룽~")
})

// 포트 기준으로 페이지 생성
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})