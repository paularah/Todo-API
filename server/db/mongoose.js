/**
 * Database configuration lives here 
 * @todo remember to switch for local db to atlas cluster. 

 */

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true} );

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected to database")
});

module.exports = {
    db:db
};
