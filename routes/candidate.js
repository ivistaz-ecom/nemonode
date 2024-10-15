
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

router.post('/hospital-details/:id', candidateControllers.add_hospitaldetails);
router.get('/get-hospital-details/:id', candidateControllers.get_HospitalDetails);
router.put('/update-c-hospital/:id',candidateControllers.update_HospitalDetails);


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
router.delete('/cdocument-delete/:id',userAuthentication.authenticate, candidateControllers.delete_Document)

router.post('/contract-details/:id',userAuthentication.authenticate, candidateControllers.add_contractdetails);
router.get('/get-contract-details/:id',userAuthentication.authenticate, candidateControllers.get_contractdetails);
router.put('/update-contract-details/:id',userAuthentication.authenticate, candidateControllers.update_contractdetails);

router.post('/discussion-plus-detail/:id',userAuthentication.authenticate, candidateControllers.add_discussionplusdetails);

router.get('/get-discussionplus-details/:id',userAuthentication.authenticate, candidateControllers.get_discussiondetails);

router.post("/login", candidateControllers.login)


router.get("/get-c-candidate/:id", candidateControllers.get_candidate)
router.put("/update-c-candidate/:id", candidateControllers.edit_candidate)
router.get('/reportsAll/:id',userAuthentication.authenticate,candidateControllers.reportAll)
router.get('/expiry-date/:id', userAuthentication.authenticate, candidateControllers.checkExpiry);
router.get('/reminder', candidateControllers.Reminder)

router.delete('/delete-nkd/:id', userAuthentication.authenticate, candidateControllers.delete_NKD);
router.delete('/delete-hospital/:id', userAuthentication.authenticate, candidateControllers.delete_Hospital);
router.delete('/delete-travel/:id', userAuthentication.authenticate, candidateControllers.delete_Travel);
router.delete('/delete-medical/:id', userAuthentication.authenticate, candidateControllers.delete_Medical);

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
router.post('/reports/callsmade',candidateControllers.calls_made)
router.get('/reports/proposals',candidateControllers.proposals)
router.get('/reports/sign-on',candidateControllers.getContractsBySignOnDate)
router.get('/reports/sign-off',candidateControllers.getContractsBySignOffDate)
router.get('/reports/duesign-off',candidateControllers.getContractsBySignOffDate)
router.get('/reports/avb-date',candidateControllers.avbCandidate)
router.get('/reports/renewal',candidateControllers.dueForRenewal)
router.get('/avbreport',candidateControllers.avbreport)
router.get('/onboard',candidateControllers.onBoard)
router.get('/onboard2',candidateControllers.onBoard2)
router.get('/onboard3',candidateControllers.onBoard3)
router.get('/crewlist',candidateControllers.crewList)
router.get('/reliefplan',candidateControllers.reliefPlan)
router.get('/mis',candidateControllers.mis)
router.get('/percentage',candidateControllers.percentage)
router.get('/statuscount',candidateControllers.getStatusCount)
router.get('/statusdata',candidateControllers.getStatusData)
router.get('/statusdate',candidateControllers.getStatusDate)
router.get('/worked',candidateControllers.workedWith)
router.post('/evaluation/:id',candidateControllers.evaluation)
router.post('/sendmail/:id',candidateControllers.sendEmail)
router.get('/evaluation-data/:id',candidateControllers.getEvaluationDetails)
router.get('/signups',candidateControllers.getSignupsCountByDate)
router.get('/signondaily',candidateControllers.getContractsBySignOnDatedaily)
router.get('/signoffdaily',candidateControllers.getContractsBySignOffDatedaily)
router.get('/exemployees',candidateControllers.getContractsAndDiscussions)
router.get('/onboardcount',candidateControllers.getCandidatesCountOnBoardForOneDay)
router.get('/dueforrenewalcount',candidateControllers.getDueForRenewalCountForOneDay)
router.get('/signoffcount',candidateControllers.getContractsCountBySignOffDateForOneDay)
router.get('/candidates/search',candidateControllers.searchCandidates)
router.get('/dueforsignoff',candidateControllers.getContractsDueForSignOff)
router.post('/verloop-webhook',candidateControllers.updateOrCreateCandidateFromVerloop)
router.post('/hover-disc/:id',candidateControllers.hoverDiscussions)
router.get('/callforoneday',candidateControllers.getCallsCountForOneDay)
router.get('/contractsdue',candidateControllers.getContractsOverTenMonths)
router.get('/contractseoc',candidateControllers.getContractsEndingSoon)
router.get('/viewevaluation/:evalid/:id',candidateControllers.viewEvaluation)
router.post('/sendApplicationMail',candidateControllers.sendApplicationEmail)



router.post('/generate-payslip', candidateControllers.generatePayslip);
router.get('/get-payslips/:contractId', candidateControllers.getPayslips);

module.exports = router;
