const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
// salt의 자리수
const saltRounds = 10
const jwt = require('jsonwebtoken')

// User 모델의 스키마
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: 1,
    },
    password: {
        type: String,
        minlength: 5,
        unique: 1,
    },
    role: {
        type: Number,
        default: 0,
    },
    token: {
        type: String,
    },
    // 토큰 유효기간
    tokenExp: {
        type: Number,
    }
})

userSchema.pre('save', function( next ) {
    var user = this

    // 비밀번호 변경시에만 password 암호화를 변경해주자!
    // 다음 조건이 없으면 아이디 변경시에도 바뀌니 문제임
    if (user.isModified('password')) {
        // 비밀번호 암호화하기
        // salt를 이용하여 비밀번호 암호화
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err)
            // hash가 암호화된 비밀번호
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})


userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainpassword를 암호화 해서 확인
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
       if (err) return cb(err)
        cb(null, isMatch) 
    })
}


userSchema.methods.generateToken = function(cb) {
    var user = this

    // JWT를 활용해서 토큰 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err, user) {
        if (err) return cb(err)
        cb(null, user)
    })
}


userSchema.statics.findByToken = function(token, cb) {
    var user = this


    // 토큰 decode
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해 유저를 찾고 
        // 클라에서 가져온 토큰과 DB의 토큰이 일치하는지 확인

        user.findOne({ "_id": decoded, "token": token }, function(err, user) {
            if (err) return cb(err)
            cb(null, user)
        })
    })
}
// User 모델을 생성
const User = mongoose.model('User', userSchema)

// 다른 파일에서도 User 모델을 사용할 수 있게 보내주기 위함
module.exports = { User }