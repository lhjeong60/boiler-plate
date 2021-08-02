const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
    }
})
// // save 메소드 실행전에 실행됨
// userSchema.pre('save', (next) => {
//     let user = this;

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

const User = mongoose.model('User', userSchema);
module.exports = { User };