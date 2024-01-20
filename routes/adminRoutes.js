const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')

router.get('/adminlogin',adminController.adminLogin)
router.post('/adminlogin',adminController.postAdminLogin)

router.get('/admin/edit/:id',adminController.edit)
router.post('/admin/update/:id',adminController.update)
router.get('/admin/delete/:id', adminController.deleteUser)

router.get('/addUser',adminController.getAddUser)
router.post('/addUser',adminController.postAddUser)

router.get('/admindashboard',adminController.adminDashboard)
router.post('/admindashboard',adminController.adminDashboard)
router.post('/log-out',adminController.adminLogout)

module.exports = router
