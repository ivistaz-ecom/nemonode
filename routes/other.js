
// loginRoutes.js
const express = require('express');
const router = express.Router();
const userAuthentication=require('../middleware/auth');

const otherControllers = require("../controllers/others")


//create
router.post("/create-vessel",userAuthentication.authenticate, otherControllers.create_vessel)
router.post("/create-vsl",userAuthentication.authenticate, otherControllers.create_VSL)
router.post("/create-experience",userAuthentication.authenticate, otherControllers.create_exp)
router.post("/create-rank",userAuthentication.authenticate, otherControllers.create_rank)
router.post("/create-grade",userAuthentication.authenticate, otherControllers.create_grade)
router.post("/create-port", userAuthentication.authenticate,otherControllers.create_port)
router.post("/create-port-agent",userAuthentication.authenticate, otherControllers.create_port_agent)
router.post("/create-hospital", userAuthentication.authenticate,otherControllers.create_hospital)
router.post("/create-document",userAuthentication.authenticate, otherControllers.create_document)
router.post("/create-vendor", userAuthentication.authenticate,otherControllers.create_vendor)
router.post("/add-crew-planner", userAuthentication.authenticate,otherControllers.create_crewPlanner)
router.post('/query',userAuthentication.authenticate,otherControllers.createQueries)

//view
router.get("/view-vessels",userAuthentication.authenticate, otherControllers.view_vessel)
router.get("/view-vsl", userAuthentication.authenticate,otherControllers.view_VSL)
router.get("/view-experience",userAuthentication.authenticate, otherControllers.view_experience)
router.get("/view-rank", userAuthentication.authenticate,otherControllers.view_rank)
router.get("/view-grade",userAuthentication.authenticate, otherControllers.view_grade)
router.get("/view-port",userAuthentication.authenticate, otherControllers.view_port)
router.get("/view-port-agent", userAuthentication.authenticate,otherControllers.view_port_agent)
router.get("/view-hospital",userAuthentication.authenticate, otherControllers.view_hospital)
router.get("/view-document",userAuthentication.authenticate, otherControllers.view_document)
router.get("/view-vendor",userAuthentication.authenticate, otherControllers.view_vendor)
router.get("/country-codes", otherControllers.view_country)
router.get("/view-crew-planner", userAuthentication.authenticate,otherControllers.view_crewPlanner)
router.get('/query-fetch', userAuthentication.authenticate, otherControllers.fetchQueries)



router.delete("/delete-vessels/:id", userAuthentication.authenticate,otherControllers.delete_vessel)
router.delete("/delete-vsl/:id", userAuthentication.authenticate,otherControllers.delete_VSL)
router.delete("/delete-experience/:id", userAuthentication.authenticate,otherControllers.delete_experience)
router.delete("/delete-rank/:id",userAuthentication.authenticate, otherControllers.delete_rank)
router.delete("/delete-grade/:id",userAuthentication.authenticate, otherControllers.delete_grade)
router.delete("/delete-port/:id", userAuthentication.authenticate,otherControllers.delete_port)
router.delete("/delete-port-agent/:id", userAuthentication.authenticate,otherControllers.delete_port_agent)
router.delete("/delete-hospital/:id",userAuthentication.authenticate, otherControllers.delete_hospital)
router.delete("/delete-document/:id", userAuthentication.authenticate,otherControllers.delete_document)
router.delete("/delete-vendor/:id",userAuthentication.authenticate, otherControllers.delete_vendor)
router.delete("/delete-crew-planner/:id",userAuthentication.authenticate, otherControllers.delete_crewPlanner)


router.put("/update-vessels/:id",userAuthentication.authenticate, otherControllers.update_vessel)
router.put("/update-vsl/:id",userAuthentication.authenticate, otherControllers.update_VSL)
router.put("/update-experience/:id",userAuthentication.authenticate, otherControllers.update_experience)
router.put("/update-rank/:id", userAuthentication.authenticate,otherControllers.update_rank)
router.put("/update-grade/:id",userAuthentication.authenticate, otherControllers.update_grade)
router.put("/update-port/:id", userAuthentication.authenticate,otherControllers.update_port)
router.put("/update-port-agent/:id",userAuthentication.authenticate, otherControllers.update_port_agent)
router.put("/update-hospital/:id",userAuthentication.authenticate, otherControllers.update_hospital)
router.put("/update-document/:id",userAuthentication.authenticate, otherControllers.update_document)
router.put("/update-vendor/:id", userAuthentication.authenticate,otherControllers.update_vendor)
router.put("/update-crew-planner/:id", userAuthentication.authenticate,otherControllers.updateCrewPlanner)
router.put('/query/:id',userAuthentication.authenticate,otherControllers.editQueries)
router.get("/get-experiences",otherControllers.get_experiences)


router.get("/get-experience/:id",otherControllers.get_experience)
router.get('/get-vessel/:id', otherControllers.getVessel);
router.get('/get-vsl/:id', otherControllers.getVSL);
router.get('/get-ranks/:id', otherControllers.get_rank);
router.get('/get-grade/:id', otherControllers.get_grade);
router.get('/get-grade-drop', otherControllers.get_gradeDrop);
router.get('/get-port/:id', otherControllers.get_port);
router.get('/get-portagents/:id', otherControllers.get_portagent);
router.get('/get-hospital/:id', otherControllers.get_hospital);
router.get('/get-document/:id', otherControllers.get_document);

router.get('/get-vsls', otherControllers.getVsls);
router.get("/get-ranks",otherControllers.view_ranks)



module.exports = router;
