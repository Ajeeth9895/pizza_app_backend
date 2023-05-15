const mongoose = require('mongoose');
const validator = require('validator')


const UsersSchema = new mongoose.Schema({

    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: {
        type: String, require: true,
    },
    mobile:{
        type: Number, require: true,
    },
    password: {
        type: String, require: true,
    },
    address: {
        type: String, require: true
    },
    city: {
        type: String, require: true
    },
    state: {
        type: String, require: true
    },
    pincode: {
        type: String, require: true
    },
    role: {
        type: String, default: "customer"
    },
    token: {
        type: String, default: ""
    },
    status: {
        type: String, default: "y"
    },
    createdAt: {
        type: Date, default: Date.now()
    }

}, { versionKey: false, collection: 'user' })

const UserModel = mongoose.model('user', UsersSchema)//
module.exports = { UserModel }

