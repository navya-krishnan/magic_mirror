
const mongoose = require("mongoose")

const magicMirrorSchema = new mongoose.Schema({

    name : {
        type : String,
        required : true,
    },
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
const magicMirror = new mongoose.model("Users",magicMirrorSchema)

// exporting the module
module.exports = magicMirror