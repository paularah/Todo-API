let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        minlength: 1
    }
});

let User =  mongoose.model('user', userSchema);

module.exports = {User:User};
 