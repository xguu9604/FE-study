// express 모듈을 불러오기
const express = require('express')
// express 모듈을 통해 앱을 생성
const app = express()
// port 주소를 지정 : 맘대로 지정 가능
const port = 5000
const bodyParser = require("body-parser")

const config = require('./config/key')

const { User } = require("./models/User")

// application/x-www-form-urlencoded 로 주어지는 데이터 분석
app.use(bodyParser.urlencoded({extended: true}))

// application/json 타입의 데이터 분석
app.use(bodyParser.json())

// db 연결해주기
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {})
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err))


// 루트 디렉토리의 기준을 알려주기
app.get('/', (req, res) => {
  res.send('Hello World! 여기다! 바뀜?')
})

app.post('/register', (req, res) => {
    // 회원가입시 필요한 정보를 받고 db에 넣어주기
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true,
        })
    })

})

// 포트 기준으로 페이지 생성
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})