
// loginRoutes.js
const express = require('express');
const router = express.Router();
const userAuthentication=require('../middleware/auth');

const companyControllers = require("../controllers/company")

router.post("/create-company",userAuthentication.authenticate,  companyControllers.add_company)
router.get("/view-company", userAuthentication.authenticate,companyControllers.getAllCompany)
router.delete('/delete-company/:id',userAuthentication.authenticate, companyControllers.delete_company);
router.put('/update-company/:id',userAuthentication.authenticate, companyControllers.update_company);
router.get('/get-company/:id',userAuthentication.authenticate, companyControllers.get_company);
router.get('/dropdown-company',userAuthentication.authenticate, companyControllers.dropdown_company);


module.exports = router;
