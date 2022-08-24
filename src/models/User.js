const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String, 
    // minlength: 1, 
    maxlength: 255
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // minlength: 6,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    // minlength: 6,
    maxlength: 255,
  },
  role: {
    type: String, 
    default: 'Customer'
  },
}, {
  timestamps : true,
});

const User = mongoose.model('User', UserSchema)

module.exports = User

