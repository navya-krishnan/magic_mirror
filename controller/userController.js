const { application } = require('express')
const userDatabase = require('../models/mongodb')
const bcrypt = require('bcrypt')

//login
const login = (req,res)=>{
    if(req.session.user){
        res.render('home') 
    }else{
        const errorMessage = req.session.errorMessage;
        req.session.errorMessage = null; // Clear the error message

        
        const succesMessage = req.session.succesMessage;
        req.session.succesMessage = null;

        res.render('login', { errorMessage ,succesMessage});
    }
}

const postLogin = async(req,res)=>{
    try {
        const enteredEmail = req.body.email
        const enteredPassword = req.body.password
        const user = await userDatabase.findOne({email:enteredEmail})
      if(user && await bcrypt.compare(enteredPassword, user.password)){ //verifying hashed password
            req.session.user = user
            console.log(req.session.user);
            console.log("Login Successful");
            res.redirect('/home')
        }else {
            req.session.errorMessage = "Invalid email or password";
            res.redirect('/login');
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Error occurred')
    }
}



//home
const home = async (req,res)=>{
    if(req.session.user){
        let user=await userDatabase.findOne({email:req.session.user.email})
        if(user)
            res.render('home')
        else{
            res.redirect('/logout')
        }
    }else{
        res.redirect('/login')
    }
}

const userLogout = (req,res)=>{
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.send("error")
        }else{
            console.log("Logout Successful");
            res.status(200)
            res.redirect('/login')
        }
    })
}

//signup
const signup = (req,res)=>{
    if(req.session.user){
        res.render('signup')
    }else{
        const errorMessage = req.session.errorMessage;
        req.session.errorMessage = null; // Clear the error message
        res.render('signup', { errorMessage });
    }
}

const postSignup = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            req.session.errorMessage = "Email and password are required";
            return res.redirect('/signup');
        }

        //hashed password
        const hashPass = 10
        const hashedPassword = await bcrypt.hash(password, hashPass);

        const details = {
            email: email,
            password: hashedPassword,
            name: name
        };

        // Check if user already exists
        const existingUser = await userDatabase.findOne({ email: email });

        if (existingUser) {
            console.log("User already exists");
            req.session.errorMessage = "User already exists";
            return res.redirect('/signup');
        }else{
                await userDatabase.insertMany(details);
                // console.log("User signup successful");
                req.session.succesMessage = "Signup Successful"
                res.redirect('/login');
            }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error occurred');
    }
};



module.exports = {
    login,
    postLogin,
    home,
    signup,
    postSignup,
    userLogout
}