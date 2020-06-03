// 백엔드의 시작점 Node의 시작점

const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://Yeong:database@bolierplate-ypsud.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology : true, useCreateIndex: true, useFindAndModify: false
}).then(()=> console.log("MongoDB Connected...")).catch(err => console.log(err))

app.get('/', (req, res)=> res.send(`Hello World! 안녕하세요`))

app.listen(port, ()=> console.log(`Express app listening on port ${port}!`))