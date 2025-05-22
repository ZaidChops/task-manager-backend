const AsyncHandler = require("express-async-handler");
const user = require('../Models/authModel')
const bcrypt =require('bcryptjs');
const jwt = require("jsonwebtoken")

// REGISTER
const registerUser = AsyncHandler(async (req, res)=>{
    // console.log(req.body)
    const {name, email, password} = req.body || {}

    if(!name || !email || !password){
        res.status(400)
        throw new Error("Please fill all details")
    }

    const userExiest = await user.findOne({email: email})
    if(userExiest){
        res.status(400)
        res.json({
            msg: "User alrady exiest!"
        })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const registerd = await user.create({
        name,
        email,
        password: hashedPassword
    })
    if(registerd){
        res.status(200).json({
            id: registerd._id,
            name: registerd.name,
            email: registerd.email,
            password: registerd.password,
            token: generateToken(registerd._id)
        })
    }
    else{
        res.status(400)
        throw new Error("Something went wrong")
    }
})

// LOGIN
const loginUser = AsyncHandler(async (req, res)=>{
    
    const {email, password} = req.body

    if(!email || !password){
        res.status(400)
        throw new Error("Please fill all details!")
    }

    const logedin = await user.findOne({email: email})

    const isMatch = user && (await bcrypt.compare(password, logedin.password));
    
    if(logedin || isMatch){
        res.status(200).json({
            id: logedin._id,
            name: logedin.name,
            email: logedin.email,
            token: generateToken(logedin._id)
        })
    }
    else{
        res.status(400)
        throw new error("Invalid credintials!")
    }
})

const generateToken = (id)=>{
    return jwt.sign({id:id}, process.env.JWT_SECRET,{expiresIn: '30d'})
}

module.exports = {registerUser, loginUser}