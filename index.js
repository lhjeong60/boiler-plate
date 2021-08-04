const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { User } = require('./models/User');
const config = require('./config/key');

const app = express();
const port = 5000;

// application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));
// application/json
app.use(express.json());

app.use(cookieParser());

mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post('/register', (req, res) => {
    //회원 가입할 때 필요한 정보들을 client에서 가져오면, 그것들을 데이터 베이스에 삽입!
    const user = new User(req.body);

    user.save((err, doc) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success:true
        })
    })
});

app.post('/login', (req, res) => {
    //요청된 이메일을 데이터베이스에 있는지 찾기
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        //요청된 이메일이 데이터베이스에 있다면 비밀번호가 일치하는지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) {
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
            } 
            
            //비밀번호까지 맞다면 토큰 생성
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                // 토큰 저장, 어디에? 쿠키, 로컬스토리지 등등 여기서는 쿠키에 저장
                res.cookie('x_auth', user.token)
                .status(200)
                .json({loginSuccess: true, userId: user._id})
                
            })
        })

    })



});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});