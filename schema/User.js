const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: String,
    token: String,
    p_list: [],
    
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    
    password: {
        type: String,
        minlength: 4
    },
   
    role: {
        type: Number,
        default: 0      // 0 : 학생  1 : 강의자
    }
})

userSchema.pre('save', function (next) {
    var user = this;

     // 패스워드 암호화  
    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err);
    
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else next();
})

// 패스워드 비교
userSchema.methods.comparePassword = function(plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        return cb(null, isMatch);
    })
}

// 토큰 생성
userSchema.methods.generateToken = function(cb) {
    var user = this;
    
    var token = jwt.sign(user._id.toHexString(), 'secretToken');

    user.token = token
    user.save(function(err, user) {
        if (err) return cb(err);
        return cb(null, user);
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    jwt.verify(token, 'secretToken', function(err, deoded) {
        user.findOne({_id: decoded, token: token}, function(err, user) {
            if (err) return cb(err);
            return cb(null, user);
        })
    })
}


const User = mongoose.model('User', userSchema);
module.exports = { User };