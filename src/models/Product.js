const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const Product = new mongoose.Schema({
    name: {type: String, minLength: 1, maxLength: 255},
    desc: {type: String},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
    image: {type: String},
    price: {type: Number, min: 0, default: 0},
    color: {type: String},  
    size: {type: String},
    available: {type: Boolean, default: true},
    deletedAt: {},
}, {
    timestamps : true,
});

//Add plugin
Product.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true
});
mongoose.plugin(slug);

module.exports = mongoose.model('Product', Product);