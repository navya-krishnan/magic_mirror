
const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({

    password :{
        type : String,
        required : true,
    },
    email :{
        type : String,
        required : true,
    }
    
})

// declaring the collection name
const adminMagic = new mongoose.model("admins",adminSchema)

// exporting the module
module.exports = adminMagic