const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const { User } = require('./models/User');
const config = require('./config/key');
const bcrypt = require('bcrypt');
const saltRounds = 10;
// application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));
// application/json
app.use(express.json());

mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

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

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});