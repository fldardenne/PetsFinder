var mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
    mail: {
        type: String,
        index: true,
        unique: true
    },
    username: {
        type: String
    },
    phone: {
        type: String
    },
    password: String,

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type:Date,
        default:Date.now
    }
  
});

var User = mongoose.model('User', userSchema);

module.exports = User