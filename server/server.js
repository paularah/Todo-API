const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const {db} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/users');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    })
    todo.save().then((doc) => {
        console.log(doc);
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
});


app.get('/todos', (req, res) => {
    Todo.find().then(todos => {
        res.status(200).send({todos});
    }, err => {
        res.status(404).send()
    })
})

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)){
        res.status(400).send()
    }

    Todo.findById(id).then(todo => {
        if (!todo){
            return res.status(404).send();
        }
        res.status(200).send({todo})
    }).catch(e => {
        res.status.send(400);
    })


})

app.listen(3000, () => {
    console.log("Up and running on port 3000");
})

module.exports = {app:app};