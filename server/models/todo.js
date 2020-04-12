let mongoose = require('mongoose');

// DB schema 

let schema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },

    completedAt: {
        type: Number,
        default: null

    }


});

// DB model

let Todo = mongoose.model('Todo', schema);

module.exports = {Todo:Todo}