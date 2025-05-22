const mongoose = require('mongoose')

const AuthSchema = new mongoose.Schema({
    name:{
        type: String,
        require: [true, "Please fill your name!"]
    },
    email:{
        type: String,
        require: [true, "Please fill your email!"]
    },
    password:{
        type: String,
        require: [true, "Please fill your password!"]
    }
}) 

module.exports = mongoose.model("user", AuthSchema)