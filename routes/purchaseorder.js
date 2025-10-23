
// loginRoutes.js
const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const userAuthentication= require('../middleware/auth')
const purchaseorderControllers = require("../controllers/api/purchaseorder")
const branchControllers = require("../controllers/api/branch")
const categoryControllers = require("../controllers/api/pocategory")
const vendorControllers = require("../controllers/api/povendor")



router.get("/getNemoDetails", userAuthentication.authenticate, purchaseorderControllers.getNemoDetails)
router.get("/list", userAuthentication.authenticate, purchaseorderControllers.getList)
router.get("/generatePO", /* userAuthentication.authenticate, */ purchaseorderControllers.generatePO)
router.post("/createPO",  userAuthentication.authenticate, purchaseorderControllers.createPO)
router.post("/uploadPoInvoice",  userAuthentication.authenticate,  upload.single("invoice"), purchaseorderControllers.uploadPoInvoice)

router.post("/branch/create", userAuthentication.authenticate, branchControllers.save)
router.get("/branch/dropdown", userAuthentication.authenticate, branchControllers.dropdownlist)
router.get("/branch/:ID", userAuthentication.authenticate, branchControllers.getDetails)
router.put("/branch/:ID", userAuthentication.authenticate, branchControllers.update)
router.delete("/branch/:ID", userAuthentication.authenticate, branchControllers.deleteData)
router.get("/branch", userAuthentication.authenticate, branchControllers.list);


router.post("/category/create", userAuthentication.authenticate, categoryControllers.save)
router.get("/category/dropdown", userAuthentication.authenticate, categoryControllers.dropdownlist)
router.get("/category/:ID", userAuthentication.authenticate, categoryControllers.getDetails)
router.put("/category/:ID", userAuthentication.authenticate, categoryControllers.update)
router.delete("/category/:ID", userAuthentication.authenticate, categoryControllers.deleteData)
router.get("/category", userAuthentication.authenticate, categoryControllers.list);


router.post("/vendor/create", userAuthentication.authenticate, vendorControllers.save)
router.get("/vendor/dropdown", userAuthentication.authenticate, vendorControllers.dropdownlist)
router.get("/vendor/:ID", userAuthentication.authenticate, vendorControllers.getDetails)
router.put("/vendor/:ID", userAuthentication.authenticate, vendorControllers.update)
router.delete("/vendor/:ID", userAuthentication.authenticate, vendorControllers.deleteData)
router.get("/vendor", userAuthentication.authenticate, vendorControllers.list);

module.exports = router;
