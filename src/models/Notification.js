const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;

const Notification = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    desc: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String},
    address: {type: String},
    phone: {type: String},
    shipping: {type: String},
    company: {type: String},
    amount: {type: Number, default: 0},
    status: {type: Boolean, default: false},
    isRead: {type: Boolean, default: false},
    slug: {type : String, slug : 'desc', unique: true},
}, {
    timestamps : true,
});
mongoose.plugin(slug);

module.exports = mongoose.model('Notification', Notification);