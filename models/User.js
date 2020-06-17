const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
    else {
        next()
    }
    // 비밀번호를 암호화 시킨다.
    // bcrypt 사용

})


userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword 12345677   암호화된 비밀번호=> 같은가?

    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}
userSchema.methods.generateToken = function(cb) {

    var user = this;
    // jsonwebToken이용해서 토큰 생성 => secretToken은 키로써 작용하므로 기억해야함
    var token = jwt.sign(user._id.toHexString(), 'secretToken');

    user.token = token;

    user.save(function(err, user){
        if (err) return cb(err);
        cb(null, user)
    })
}
userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // 토큰을 decode 한다
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 ID를 이용해서 유저를 찾은 다음에 
        // 클라이언트에서 가져온 token과 데이터베이스에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id" : decoded, "token" : token}, function(err, user) {
            if (err) return cb(err);
            cb(null, user)
        })
    });
}


// 유저는 유저 스키마와 위에 해당하는 function들을 모두 포함하는 하나의 모듈이자 모델로서 사용됨

const User = mongoose.model('User', userSchema)


module.exports = { User }