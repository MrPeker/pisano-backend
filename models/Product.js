const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ProductSchema = new Schema({
    title: String,
    model: String,
    rate: String,
    image: String,
    sellers: [{
        title: String,
        price: Number,
        shipment: String,
        seller: String,
        url: String,
    }],
    comments: [],
    features: String
});

module.exports = mongoose.model('Product', ProductSchema);
