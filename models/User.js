const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
// salt를 이용해서 비밀번호를 암호화 => salt 생성 
const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength : 50
    },
    email : {
        type : String,
        trim : true, // 중간 공백을 없애주는 역할
        unique : 1
    },
    password: {
        type : String,
        minlength : 5
    },
    lastname: { 
        type : String, 
        maxlength : 50
    },
    role : {
        type : Number,
        default : 0
    },
    image : String,
    token : {
        type : String
    },
    tokenExp : {
        type : Number
    }

})

// 몽구스 디비에서 가져오는 명령어 pre
// 몽구스 디비에 저장하기 전에 무엇을 한다는 문구
userSchema.pre('save', function( next ){
    var user = this;

    // 비밀번호 암호화, 생성시에만
    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            } )
        })
    }
    // 비밀번호를 암호화 시킨다.
    // bcrypt 사용

})

const User = mongoose.model('User', userSchema)

module.exports = { User }