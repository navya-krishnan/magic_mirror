//importing modules
const express = require("express")
const app = express()
const mongoose = require('mongoose')
const path = require("path")
const bodyParser=require('body-parser')
const session = require('express-session')
const userRouter = require('./routes/userRoutes')
const adminRouter = require('./routes/adminRoutes')
const magicMirror = require('./models/mongodb'); 
const adminMagic = require("./models/admin")
const nocache = require("nocache")
const bcrypt = require("bcrypt")
require('dotenv').config();


// Set up session middleware

const secretKey = process.env.SECRET_KEY;
if (!secretKey) {
    console.error("SECRET_KEY is missing in the environment variables.");
    process.exit(1);
}

app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true
 }));
 

// connecting the mongodb server
mongoose.connect("mongodb://127.0.0.1:27017/magicMirror")
.then(()=>{
    console.log("Mongodb is connected properly");
}).catch(()=>{
    console.log("Mongodb is not connected properly");
})


// Parsing
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true})); //used to parse nested objects


app.use(nocache())

// setting the view engines
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.static('public'))

//Routes
app.use('/',userRouter)
app.use('/',adminRouter)


//connecting port
app.listen(5000,()=>{
    console.log("Listening to server 3000")

})

