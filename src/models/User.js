const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const findOrCreate = require('mongoose-findorcreate');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, minlength: 1, maxlength: 255 },
  email: { type: String, unique: true, minlength: 1, maxlength: 255 },
  password: { type: String, maxlength: 255 },
  role: { type: String, default: 'Customer' },
  phone: {type: String, maxLength: 11},
  birthday: {type: Date, default: 0},
  address: {type: String, minLength: 1, maxLength: 255},
  gender: {type: String, default: 'male'},
  googleId: { type: String,},
  facebookId: {type: String},
  deletedAt: {},
}, {
  timestamps : true,
});

//Add plugin
UserSchema.plugin(mongooseDelete, {
  overrideMethods: 'all',
  deletedAt: true
});
mongoose.plugin(slug);
mongoose.plugin(findOrCreate);
mongoose.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema)

module.exports = User

