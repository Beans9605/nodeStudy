// 백엔드의 시작점 Node의 시작점

const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

const { User } = require('./models/User');
const config = require('./config/key');
// application/x-www-form-urlendcoded
app.use(bodyParser.urlencoded({extended:true}));

// application/json
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology : true, useCreateIndex: true, useFindAndModify: false
}).then(()=> console.log("MongoDB Connected...")).catch(err => console.log(err));

app.get('/', (req, res)=> res.send(`Hello World! ㅎㅇㅎㅇ 안녕하세요 여러분 공부하는거 전부 잘 해결하시길 바라겠습니다.`));




app.post('/register', (req, res)=>{
    // 회원 가입 할때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터 베이스에 넣어준다.
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({success:false, err})
        return res.status(200).json({
            success:true
        })
    })
})


app.listen(port, ()=> console.log(`Express app listening on port ${port}!`))