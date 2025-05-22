const mongoose = require('mongoose')

const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("DB connection successful :", conn.connection.host.green)
    } catch (error) {
        console.log("Error in DB connection".red, error.message)
    }
}

module.exports = {connectDB}