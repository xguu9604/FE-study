const mongoose = require('mongoose')

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

// User 모델을 생성
const User = mongoose.model('User', userSchema)

// 다른 파일에서도 User 모델을 사용할 수 있게 보내주기 위함
module.exports = { User }