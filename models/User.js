var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    username: {type: String, unique: true},
    name: {type:String},
    about: {},
    profile:{type:[{concept: String, occurrences: Number}]}
});

module.exports = mongoose.model('user', User);