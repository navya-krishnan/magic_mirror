const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')

router.get('/login',userController.login)
router.post('/',userController.postLogin)

router.get('/home',userController.home)
router.get('/logout',userController.userLogout)

router.get('/signup',userController.signup)
router.post('/signup',userController.postSignup)

module.exports = router