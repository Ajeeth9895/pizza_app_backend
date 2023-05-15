const mongoose = require('mongoose');
const validator = require('validator')


const OrderSchema = new mongoose.Schema({

    products: { type: String, require: true },
    price: { type: String, require: true },
    name: { type: String, require: true },
    email: {
        type: String, require: true,
    },
    qty: {
        type: String, require: true,
    },
    total_amount: {
        type: String, require: true,
    },
    status: {
        type: String, default: "pending"
    },
    createdAt: {
        type: Date, default: Date.now()
    }

}, { versionKey: false, collection: 'orders' })

const OrderModel = mongoose.model('orders', OrderSchema)//
module.exports = { OrderModel }

