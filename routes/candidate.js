
// loginRoutes.js
const express = require('express');
const router = express.Router();
const userAuthentication = require("../middleware/auth")

const candidateControllers = require("../controllers/candidate")

router.post("/add-candidate",userAuthentication.authenticate, candidateControllers.add_candidate)
router.get("/view-candidate",userAuthentication.authenticate, candidateControllers.getAllCandidates)
router.get("/get-candidate/:id",userAuthentication.authenticate, candidateControllers.get_candidate)
router.put("/update-candidate/:id",userAuthentication.authenticate, candidateControllers.edit_candidate)
router.put("/update-candidates/:id",userAuthentication.authenticate, candidateControllers.updateCandidateFields)
router.delete("/delete-candidate/:id",userAuthentication.authenticate, candidateControllers.delete_candidate)

router.get("/getCount",userAuthentication.authenticate,candidateControllers.getCandidateActiveDetailsCount)
router.get("/getGraph",userAuthentication.authenticate,candidateControllers.getCandidateRankCounts)

router.post('/kin-details/:id',userAuthentication.authenticate, candidateControllers.add_kindetails);
router.get('/get-nkd-details/:id',userAuthentication.authenticate, candidateControllers.get_NKDDetails);
router.put('/update-nkd/:id',userAuthentication.authenticate, candidateControllers.update_NKDDetails);

router.post('/hospital-details/:id',userAuthentication.authenticate, candidateControllers.add_hospitaldetails);
router.get('/get-hospital-details/:id',userAuthentication.authenticate, candidateControllers.get_HospitalDetails);
router.put('/update-c-hospital/:id',userAuthentication.authenticate, candidateControllers.update_HospitalDetails);


router.post('/travel-details/:id',userAuthentication.authenticate, candidateControllers.add_traveldetails);
router.get('/get-travel-details/:id',userAuthentication.authenticate, candidateControllers.get_TravelDetails);
router.put('/update-travel/:id',userAuthentication.authenticate, candidateControllers.update_TravelDetails);

router.post('/bank-details/:id',userAuthentication.authenticate, candidateControllers.add_bankdetails);
router.get('/get-bank-details/:id',userAuthentication.authenticate, candidateControllers.get_BankDetails);
router.put('/update-bank-details/:id',userAuthentication.authenticate, candidateControllers.update_BankDetails);


router.post('/document-details/:id',userAuthentication.authenticate, candidateControllers.add_documentdetails);
router.post('/cdocument-detail/:id', candidateControllers.add_documentdetails);
router.get('/get-document-details/:id',userAuthentication.authenticate, candidateControllers.get_documentdetails);
router.get('/get-cdocument-detail/:id', candidateControllers.get_documentdetails);
router.put('/update-documents/:id',userAuthentication.authenticate, candidateControllers.update_documentdetails);
router.put('/update-cdocument/:id', candidateControllers.update_documentdetails);
router.delete('/cdocument-delete/:id',candidateControllers.delete_Document)

router.post('/contract-details/:id',userAuthentication.authenticate, candidateControllers.add_contractdetails);
router.get('/get-contract-details/:id',userAuthentication.authenticate, candidateControllers.get_contractdetails);
router.put('/update-contract-details/:id',userAuthentication.authenticate, candidateControllers.update_contractdetails);

router.post('/discussion-plus-detail/:id',userAuthentication.authenticate, candidateControllers.add_discussionplusdetails);

router.get('/get-discussionplus-details/:id',userAuthentication.authenticate, candidateControllers.get_discussiondetails);

router.post("/login", candidateControllers.login)


router.get("/get-c-candidate/:id", candidateControllers.get_candidate)
router.put("/update-c-candidate/:id", candidateControllers.edit_candidate)
router.get('/reportsAll',userAuthentication.authenticate,candidateControllers.reportAll)
router.get('/expiry-date/:id', userAuthentication.authenticate, candidateControllers.checkExpiry);
router.get('/reminder',userAuthentication.authenticate, candidateControllers.Reminder)

router.delete('/delete-nkd/:id', userAuthentication.authenticate, candidateControllers.delete_NKD);
router.delete('/delete-hospital/:id', userAuthentication.authenticate, candidateControllers.delete_Hospital);
router.delete('/delete-travel/:id', userAuthentication.authenticate, candidateControllers.delete_Travel);
router.delete('/delete-bank/:id', userAuthentication.authenticate, candidateControllers.delete_Bank);
router.delete('/delete-document/:id', userAuthentication.authenticate, candidateControllers.delete_Document);
router.delete('/delete-contract/:id', userAuthentication.authenticate, candidateControllers.delete_contract);
router.delete('/delete-discussionplus/:id', userAuthentication.authenticate, candidateControllers.delete_discussionplus);

router.delete('/delete-sea-service/:id', userAuthentication.authenticate, candidateControllers.deleteSeaService);
router.put('/edit-sea-service/:id',userAuthentication.authenticate,candidateControllers.editSeaService)
router.post('/sea-service/:id',userAuthentication.authenticate,candidateControllers.createSeaService)
router.get('/get-sea-service/:id',userAuthentication.authenticate,candidateControllers.getAllSeaService)
router.get('/get-sea/:id',userAuthentication.authenticate,candidateControllers.getSea)

router.post('/reports/view-new-profile',userAuthentication.authenticate,candidateControllers.new_profile)
router.post('/reports/contract',userAuthentication.authenticate,candidateControllers.contract)
router.get('/birthday',userAuthentication.authenticate,candidateControllers.birthday)
router.get('/call-count',userAuthentication.authenticate,candidateControllers.getCallCount);
router.get('/discussion-count',userAuthentication.authenticate,candidateControllers.countOperations);
router.post('/callsmade',userAuthentication.authenticate,candidateControllers.calls_made)

module.exports = router;
