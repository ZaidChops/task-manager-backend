const express = require('express')
const cors = require("cors")
const dotenv = require('dotenv').config()
const { connectDB } = require('./Config/db-config')
const colors = require('colors')

const app = express()
const PORT = process.env.PORT || 8000

connectDB()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/user', require('./Routes/authRouts'))
app.use('/api/tasks', require('./Routes/taskRoutes'))

app.get('/',(req,res)=>{
    res.json({
        msg: "Wellcome to Task Management API"
    })
})

app.listen(PORT, ()=>{
    console.log(`Server is running at PORT ${PORT}`.blue)
})