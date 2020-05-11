const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

const {db} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/users');

const app = express();
// const port = process.env.port || 3000;

const postRoutes = require('./routes/post');
const getRoutes = require('./routes/get');
const patchRoutes = require('./routes/patch');
const deleteRoutes = require('./routes/delete');

//middlewares
app.use(bodyParser.json());
app.use('/post', postRoutes);
app.use('/get', getRoutes);
app.use('/delete', deleteRoutes);
app.use('/patch', patchRoutes);


app.listen(3000, () => {
    //console.log(`Up and running on port ${port}`);
});

module.exports = {app:app};