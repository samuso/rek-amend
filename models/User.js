var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    _id:{type: String, unique:true},
    username: {type: String, unique: true},
    name: {type:String},
    about: {},
    profile:{type:[String]}
});

module.exports = mongoose.model('test', User);