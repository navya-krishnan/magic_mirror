const app = require('express')
const adminDatabase = require('../models/admin')
const userDatabase = require('../models/mongodb')
const magicMirror = require('../models/mongodb')

//adminlogin

const adminLogin = (req,res)=>{
    if (req.session.isAdminLoggedIn) {
        return res.redirect('/admindashboard')
    }else{
        res.render('adminlogin')

    }
}

const postAdminLogin = async(req,res)=>{
    try {
        const enteredEmail = req.body.email
        const enteredPassword = req.body.password
        const admin = await adminDatabase.findOne({email:enteredEmail})
        if(!admin){
            res.redirect('/adminlogin')
        }else if(admin && admin.password === enteredPassword){
            req.session.isAdminLoggedIn = true;
            res.redirect('/admindashboard')
        }else{
            res.redirect('/adminlogin')
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Error occured')
    }
}

//admindashboard

const adminDashboard = async (req, res) => {
    try {
        if (!req.session.isAdminLoggedIn) {
            return res.redirect('/adminlogin');
        } else {
            let users;
            let searchTerm =""

            // Check if search term is provided
            if (req.method === 'POST' && req.body.search) {
                // Use a regular expression for case-insensitive search
                const searchRegex = new RegExp(req.body.search, 'i');
                users = await magicMirror.find({
                    $or: [
                        { name: searchRegex },
                        { email: searchRegex }
                    ]
                });
                searchTerm = req.body.search
            } else {
                users = await magicMirror.find();
            }

            const currentPage = 1; // Replace with the actual current page
            const itemsPerPage = 10; // Replace with the actual items per page
            const totalEntries = users.length;

            const updateMessage = req.session.updateMessage;
            req.session.updateMessage = null;

            const deleteMessage = req.session.deleteMessage;
            req.session.deleteMessage = null;

            const addMessage = req.session.updateMessage;
            req.session.addMessage = null;

            res.render('admindashboard', { users, currentPage, itemsPerPage, totalEntries ,updateMessage, deleteMessage, addMessage,searchTerm});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error occurred');
    }
}


const adminLogout = (req,res)=>{
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.send("error")
        }else{
            console.log("Logout Successful");
            res.status(200)
            res.redirect('/adminlogin')
        }
    })
}

// editing the user
const edit = async(req,res)=>{
    try {
        const id = req.params.id;
        const user = await magicMirror.findById(id);

        if (!user) {
            res.redirect('/admin');
        } else {
            req.session.user = user
            res.render('editUser', { user: user });
        }
    } catch (err) {
        console.log("Error in finding the user : ", err);
        res.redirect('/admin');
    }
}

// updating the user
const update = async(req,res)=>{
    try {
        const id = req.params.id
        const result = await magicMirror.findByIdAndUpdate(id,{
            name : req.body.name,
            password : req.body.password,
            email : req.body.email
        })
        if(!result){
            res.redirect('/adminlogin',{message : 'User not found',type : 'danger'})
        }else { 
            console.log("User updated sucessfully");
            req.session.updateMessage = "User updated successfully"
            res.redirect('/adminlogin')
        }
    } catch (err) {
        console.log('Error updating the user : ',err);
        res.redirect('/adminlogin',{message : err.message, type :'danger'})
    }
}

//deleting the user
const deleteUser = async(req,res)=>{
    try {
        const id = req.params.id;
        const deleted = await magicMirror.findByIdAndDelete({_id: id});
         if (deleted) {
        console.log('User deleted successfully');
        req.session.deleteMessage = "User deleted successfully"
        res.redirect('/admindashboard');
      } else {
        res.redirect('/admindashboard',{ message: 'User not found' });
      }
    } catch (err) {
        console.error('Error deleting user: ', err);
        res.redirect('/adminlogin',{ message: err.message });
    }
}

//adding new user

const getAddUser = (req,res)=>{
    if(req.session.isAdminLoggedIn){
        return res.render('addUser')
    }else{
        res.render('admindashboard')
    }
}


const postAddUser = async (req, res) => {
    try {
        const { name, password, email } = req.body;
        // Validate if name, password, and email are provided
        if (!name || !password || !email) {
            return res.status(400).send('Name, password, and email are required');
        }
        const existingUser = await userDatabase.findOne({ email: req.body.email });

        if (existingUser) {
            console.log("User found: " + existingUser);
            res.redirect('/adminlogin');
        } else { 
            const { name, password, email } = req.body;
            const newUser = new userDatabase({
                name: name,
                password: password,
                email: email
            });

            await newUser.save();

            console.log("User added successfully")
            req.session.updateMessage = "User added successfully"
            res.redirect('/admindashboard');
        }
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).send('Error occurred');
    }
};


module.exports = {
    adminLogin,
    postAdminLogin,
    adminDashboard,
    adminLogout,
    edit,
    update,
    deleteUser,
    getAddUser,
    postAddUser
}

