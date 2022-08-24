const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Product = new mongoose.Schema({
    name: {type: String, minLength: 1, maxLength: 255},
    desc: {type: String},
    category: {type: String},
    image: {type: String, minLength: 1, maxLength: 255},
    price: {type: Number, min: 0, default: 0},
    color: {type: String},
    size: {type: String}
    // deletedAt: {},
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