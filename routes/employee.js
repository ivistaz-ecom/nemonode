
// loginRoutes.js
const express = require('express');
const router = express.Router();

const userAuthentication= require('../middleware/auth')
const employeeControllers = require("../controllers/api/employee")
const empdesignationControllers = require("../controllers/api/empdesignation")
const empdepartmentControllers = require("../controllers/api/empdepartment")
const empskillControllers = require("../controllers/api/empskill")
const emplanguagemasterControllers = require("../controllers/api/emplanguagemaster")
const empindustrymasterControllers = require("../controllers/api/empindustrymaster")
const employeeprevcompanyControllers = require("../controllers/api/employeeprevcompany")
const employeefamilyControllers = require("../controllers/api/employeefamily")
const empstaffcategoryControllers = require("../controllers/api/empstaffcategory")
const empcompanyControllers = require("../controllers/api/empcompany")
const empbranchControllers = require("../controllers/api/empbranch")
const empmodeofentryontrollers = require("../controllers/api/empmodeofentry")
const empidentitycontrollers = require("../controllers/api/empidentity")
const employeeidentityControllers = require("../controllers/api/employeeidentity")
const empcityControllers = require("../controllers/api/empcity")
const empdoctypeControllers = require("../controllers/api/empdoctype")
const employeedocumentControllers = require("../controllers/api/employeedocument")
const employeeskillsetControllers = require("../controllers/api/employeeskillset")
const employeelanguageControllers = require("../controllers/api/employeelanguage")


router.post("/designation/create", userAuthentication.authenticateEmloyee, empdesignationControllers.save)
router.get("/designation/dropdown", userAuthentication.authenticateEmloyee, empdesignationControllers.dropdownlist)
router.get("/designation/:ID", userAuthentication.authenticateEmloyee, empdesignationControllers.getDetails)
router.put("/designation/:ID", userAuthentication.authenticateEmloyee, empdesignationControllers.update)
router.delete("/designation/:ID", userAuthentication.authenticateEmloyee, empdesignationControllers.deleteData)
router.get("/designation", empdesignationControllers.list);

router.post("/department/create", userAuthentication.authenticateEmloyee, empdepartmentControllers.save)
router.get("/department/dropdown", userAuthentication.authenticateEmloyee, empdepartmentControllers.dropdownlist)
router.get("/department/:ID", userAuthentication.authenticateEmloyee, empdepartmentControllers.getDetails)
router.put("/department/:ID", userAuthentication.authenticateEmloyee, empdepartmentControllers.update)
router.delete("/department/:ID", userAuthentication.authenticateEmloyee, empdepartmentControllers.deleteData)
router.get("/department", empdepartmentControllers.list);

router.post("/skill/create", userAuthentication.authenticateEmloyee, empskillControllers.save)
router.get("/skill/dropdown", userAuthentication.authenticateEmloyee, empskillControllers.dropdownlist)
router.get("/skill/:ID", userAuthentication.authenticateEmloyee, empskillControllers.getDetails)
router.put("/skill/:ID", userAuthentication.authenticateEmloyee, empskillControllers.update)
router.delete("/skill/:ID", userAuthentication.authenticateEmloyee, empskillControllers.deleteData)
router.get("/skill", empskillControllers.list);

router.post("/language/create", userAuthentication.authenticateEmloyee, emplanguagemasterControllers.save)
router.get("/language/dropdown", userAuthentication.authenticateEmloyee, emplanguagemasterControllers.dropdownlist)
router.get("/language/:ID", userAuthentication.authenticateEmloyee, emplanguagemasterControllers.getDetails)
router.put("/language/:ID", userAuthentication.authenticateEmloyee, emplanguagemasterControllers.update)
router.delete("/language/:ID", userAuthentication.authenticateEmloyee, emplanguagemasterControllers.deleteData)
router.get("/language", emplanguagemasterControllers.list);

router.post("/industry/create", userAuthentication.authenticateEmloyee, empindustrymasterControllers.save)
router.get("/industry/dropdown", userAuthentication.authenticateEmloyee, empindustrymasterControllers.dropdownlist)
router.get("/industry/:ID", userAuthentication.authenticateEmloyee, empindustrymasterControllers.getDetails)
router.put("/industry/:ID", userAuthentication.authenticateEmloyee, empindustrymasterControllers.update)
router.delete("/industry/:ID", userAuthentication.authenticateEmloyee, empindustrymasterControllers.deleteData)
router.get("/industry", empindustrymasterControllers.list);

router.post("/prevcompany/create", userAuthentication.authenticateEmloyee, employeeprevcompanyControllers.save)
router.get("/prevcompany/:ID", userAuthentication.authenticateEmloyee, employeeprevcompanyControllers.getDetails)
router.put("/prevcompany/:ID", userAuthentication.authenticateEmloyee, employeeprevcompanyControllers.update)
router.delete("/prevcompany/:ID", userAuthentication.authenticateEmloyee, employeeprevcompanyControllers.deleteData)
router.get("/prevcompany", employeeprevcompanyControllers.list);

router.post("/family/create", userAuthentication.authenticateEmloyee, employeefamilyControllers.save)
router.get("/family/:ID", userAuthentication.authenticateEmloyee, employeefamilyControllers.getDetails)
router.put("/family/:ID", userAuthentication.authenticateEmloyee, employeefamilyControllers.update)
router.delete("/family/:ID", userAuthentication.authenticateEmloyee, employeefamilyControllers.deleteData)
router.get("/family", employeefamilyControllers.list);

router.post("/staffcategory/create", userAuthentication.authenticateEmloyee, empstaffcategoryControllers.save)
router.get("/staffcategory/dropdown", userAuthentication.authenticateEmloyee, empstaffcategoryControllers.dropdownlist)
router.get("/staffcategory/:ID", userAuthentication.authenticateEmloyee, empstaffcategoryControllers.getDetails)
router.put("/staffcategory/:ID", userAuthentication.authenticateEmloyee, empstaffcategoryControllers.update)
router.delete("/staffcategory/:ID", userAuthentication.authenticateEmloyee, empstaffcategoryControllers.deleteData)
router.get("/staffcategory", empstaffcategoryControllers.list);


router.post("/company/create", userAuthentication.authenticateEmloyee, empcompanyControllers.save)
router.get("/company/dropdown", userAuthentication.authenticateEmloyee, empcompanyControllers.dropdownlist)
router.get("/company/:ID", userAuthentication.authenticateEmloyee, empcompanyControllers.getDetails)
router.put("/company/:ID", userAuthentication.authenticateEmloyee, empcompanyControllers.update)
router.delete("/company/:ID", userAuthentication.authenticateEmloyee, empcompanyControllers.deleteData)
router.get("/company", empcompanyControllers.list);

router.post("/branch/create", userAuthentication.authenticateEmloyee, empbranchControllers.save)
router.get("/branch/dropdown", userAuthentication.authenticateEmloyee, empbranchControllers.dropdownlist)
router.get("/branch/:ID", userAuthentication.authenticateEmloyee, empbranchControllers.getDetails)
router.put("/branch/:ID", userAuthentication.authenticateEmloyee, empbranchControllers.update)
router.delete("/branch/:ID", userAuthentication.authenticateEmloyee, empbranchControllers.deleteData)
router.get("/branch", empbranchControllers.list);

router.post("/modeofentry/create", userAuthentication.authenticateEmloyee, empmodeofentryontrollers.save)
router.get("/modeofentry/dropdown", userAuthentication.authenticateEmloyee, empmodeofentryontrollers.dropdownlist)
router.get("/modeofentry/:ID", userAuthentication.authenticateEmloyee, empmodeofentryontrollers.getDetails)
router.put("/modeofentry/:ID", userAuthentication.authenticateEmloyee, empmodeofentryontrollers.update)
router.delete("/modeofentry/:ID", userAuthentication.authenticateEmloyee, empmodeofentryontrollers.deleteData)
router.get("/modeofentry", empmodeofentryontrollers.list);

router.post("/identity/create", userAuthentication.authenticateEmloyee, empidentitycontrollers.save)
router.get("/identity/dropdown", userAuthentication.authenticateEmloyee, empidentitycontrollers.dropdownlist)
router.get("/identity/:ID", userAuthentication.authenticateEmloyee, empidentitycontrollers.getDetails)
router.put("/identity/:ID", userAuthentication.authenticateEmloyee, empidentitycontrollers.update)
router.delete("/identity/:ID", userAuthentication.authenticateEmloyee, empidentitycontrollers.deleteData)
router.get("/identity", empidentitycontrollers.list);

router.post("/empidentity/create", userAuthentication.authenticateEmloyee, employeeidentityControllers.save)
router.get("/empidentity/:ID", userAuthentication.authenticateEmloyee, employeeidentityControllers.getDetails)
router.put("/empidentity/:ID", userAuthentication.authenticateEmloyee, employeeidentityControllers.update)
router.delete("/empidentity/:ID", userAuthentication.authenticateEmloyee, employeeidentityControllers.deleteData)
router.get("/empidentity", employeeidentityControllers.list);

router.post("/city/create", userAuthentication.authenticateEmloyee, empcityControllers.save)
router.get("/city/dropdown", userAuthentication.authenticateEmloyee, empcityControllers.dropdownlist)
router.get("/city/:ID", userAuthentication.authenticateEmloyee, empcityControllers.getDetails)
router.put("/city/:ID", userAuthentication.authenticateEmloyee, empcityControllers.update)
router.delete("/city/:ID", userAuthentication.authenticateEmloyee, empcityControllers.deleteData)
router.get("/city", empcityControllers.list);

router.post("/doctype/create", userAuthentication.authenticateEmloyee, empdoctypeControllers.save)
router.get("/doctype/dropdown", userAuthentication.authenticateEmloyee, empdoctypeControllers.dropdownlist)
router.get("/doctype/:ID", userAuthentication.authenticateEmloyee, empdoctypeControllers.getDetails)
router.put("/doctype/:ID", userAuthentication.authenticateEmloyee, empdoctypeControllers.update)
router.delete("/doctype/:ID", userAuthentication.authenticateEmloyee, empdoctypeControllers.deleteData)
router.get("/doctype", empdoctypeControllers.list);

router.post("/document/create", userAuthentication.authenticateEmloyee, employeedocumentControllers.save)
router.get("/document/:ID", userAuthentication.authenticateEmloyee, employeedocumentControllers.getDetails)
router.put("/document/:ID", userAuthentication.authenticateEmloyee, employeedocumentControllers.update)
router.delete("/document/:ID", userAuthentication.authenticateEmloyee, employeedocumentControllers.deleteData)
router.get("/document", employeedocumentControllers.list);

router.post("/skillset/create", userAuthentication.authenticateEmloyee, employeeskillsetControllers.save)
router.get("/skillset/:ID", userAuthentication.authenticateEmloyee, employeeskillsetControllers.getDetails)
router.put("/skillset/:ID", userAuthentication.authenticateEmloyee, employeeskillsetControllers.update)
router.delete("/skillset/:ID", userAuthentication.authenticateEmloyee, employeeskillsetControllers.deleteData)
router.get("/skillset", employeeskillsetControllers.list);


router.post("/employeelanguage/create", userAuthentication.authenticateEmloyee, employeelanguageControllers.save)
router.get("/employeelanguage/:ID", userAuthentication.authenticateEmloyee, employeelanguageControllers.getDetails)
router.put("/employeelanguage/:ID", userAuthentication.authenticateEmloyee, employeelanguageControllers.update)
router.delete("/employeelanguage/:ID", userAuthentication.authenticateEmloyee, employeelanguageControllers.deleteData)
router.get("/employeelanguage", employeelanguageControllers.list);


router.post("/uploadPDFReader", employeeControllers.uploadPDFReader);


router.post("/login", employeeControllers.loginEmployee);
router.post("/create", userAuthentication.authenticateEmloyee, employeeControllers.createEmployee);

router.put("/updatemiscellaneous", userAuthentication.authenticateEmloyee, employeeControllers.updateMiscellaneous)
router.put("/updatesalary", userAuthentication.authenticateEmloyee, employeeControllers.updateSalary)
router.get("/dropdown", userAuthentication.authenticateEmloyee, employeeControllers.dropdownlist)
router.get("/:ID", userAuthentication.authenticateEmloyee, employeeControllers.getEmployeeDetails)
router.put("/:ID", userAuthentication.authenticateEmloyee, employeeControllers.updateEmployee);
router.get("/", userAuthentication.authenticateEmloyee, employeeControllers.listEmployee)


module.exports = router;
