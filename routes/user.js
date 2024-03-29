
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
// router.post('/search', userControllers.search);
// router.post('/searchAll', userControllers.searchAll);
router.get("/view-user",userAuthentication.authenticate,userControllers.view_user)

module.exports = router;
