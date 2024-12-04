
// loginRoutes.js
const express = require('express');
const router = express.Router();

const userAuthentication= require('../middleware/auth')
const userControllers = require("../controllers/user")

router.post("/create-user/:id", userControllers.create_user)
router.post("/login", userControllers.login)
router.put('/update-user/:id', userControllers.edit_user);
router.delete('/delete-user/:id', userControllers.delete_user);
router.get('/get-user/:id',userControllers.get_user)
router.get("/view-user",userAuthentication.authenticate,userControllers.view_user)
router.get('/userdropdown',userControllers.userDropdown)
router.put('/:userId/logout',userControllers.updateLogout)
router.put('/edit-userdata/:id',userControllers.updateUserData)
router.post('/temp-login',userControllers.tempLogin)
router.post('/temp-change-password',userControllers.tempChange)
router.post("/canditatelogin", userControllers.canditatelogin)

router.get('/current-user',userControllers.currentuserDropdown)

module.exports = router;
