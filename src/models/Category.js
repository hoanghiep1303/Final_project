const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const Category = new Schema({
    name: { type: String },
    deletedAt: {},
}, {
    timestamps : true,
});

//Add plugin
Category.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true
});


module.exports = mongoose.model('Category', Category);