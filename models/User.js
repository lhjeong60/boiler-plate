const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //공백 없애주는 역할
        unique: 1 //중복 안되게끔
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: { // 유효성?
        type: String
    },
    tokenExp: {
        type: Number
    }
})

// save 메소드 실행전에 실행됨
userSchema.pre('save', function(next) {
    const user = this;

    if(user.isModified('password')) { //password 입력이 변경되었을 때만
        // 비밀번호 암호화
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if(err) return next(err)
    
            bcrypt.hash(user.password, salt, (err, hash) => {
                if(err) return next(err)
                user.password = hash
    
                // 다음으로 이동!. 여기서는 save 메소드
                next()
            })
        })
    } else {
        next()
    }
})
// // save 메소드 실행전에 실행됨
// userSchema.pre('save', (next) => {
//     const user = this;
//     console.log(user);

//     if(user.isModified('password')) { //password 입력이 변경되었을 때만
//         // 비밀번호 암호화
//         bcrypt.genSalt(saltRounds, (err, salt) => {
//             if(err) return next(err)
    
//             bcrypt.hash(user.password, salt, (err, hash) => {
//                 if(err) return next(err)
//                 user.password = hash
    
//                 // 다음으로 이동!. 여기서는 save 메소드
//                 next()
//             })
//         })
//     }
// })

// 비밀번호 일치 확인 메소드 추가
userSchema.methods.comparePassword = function (plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

// 토큰생성하기
userSchema.methods.generateToken = function (cb) {
    //jsonwebtoken을 이용해서 token 생성
    const user = this;

    const token = jwt.sign({_id: user._id}, 'secretToken')

    user.token = token
    user.save((err, user) => {
        if(err) return cb(err)
        cb(null, user)
    })

}

const User = mongoose.model('User', userSchema);
module.exports = { User };