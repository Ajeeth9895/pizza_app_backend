const mongodb = require('mongodb')
const dbName = 'pizza_app'
const dbUrl = `mongodb+srv://ajeeth:Ajee12345@cluster0.gprm31v.mongodb.net/${dbName}`;


module.exports = { mongodb, dbName, dbUrl};