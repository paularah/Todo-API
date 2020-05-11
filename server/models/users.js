const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');


let userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            mesaage: 'Invaid Email Value'

        }
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.methods.generateAuthToken = async function(){
    try{
        let user = this;
        let access = 'auth';
        let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123');
        user.tokens.push({access, token});
        await user.save()
        return token
    
    }catch(e){
        console.log(e);
    }
}

userSchema.methods.toJSON = function(){
    let user = this.toObject();
    return _.pick(user, ['_id', 'email'])
}

let User =  mongoose.model('user', userSchema);

module.exports = {User:User};
  