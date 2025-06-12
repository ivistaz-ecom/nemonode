const Employee = require("../../models/employee");
const employeemiscellaneous = require("../../models/employeemiscellaneous");
const employeesalary = require("../../models/employeesalary");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../../util/database");
const { Op } = require("sequelize");
const { base64decode } = require("nodejs-base64");

function generateAccessToken(employeeID, empUserName, empCode) {
  return jwt.sign(
    { employeeID: employeeID, empUserName: empUserName, empCode: empCode },
    "secretkey"
  );
}

const createEmployee = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const employeeID = req.user.employeeID;
    // Get user information from the authenticated user
    const {
      empUserName,
      empPassword,
      empTitle,
      empFirstName,
      empMiddleName,
      empLastName,
      empShortName,
      empCode,
      empStatus,
      empDesignation,
      empDepartment,
      empCity,
      empBloodGroup,
      empDOB,
      empDOJ,
      empGratuityStartDate,
      empWEF,
      empReportingBy,
      empApprovedBy,
      empContractType,
      empEmail,
      empGender,
      empTransferDate,
      empExpectedConfirmationDate,
      empProbationPeriod,
      empConfirmationDate,
      empDateOfLeaving,
      empLastWorkingDate,
      empRetirementDate,
      empPayStructureAppliedFromDate,
      empNoticePeriodForEmployer,
      empNoticePeriodforEmployee,
    } = req.body;

    console.log(req.body);
    const saltrounds = 10;

    bcrypt.hash(empPassword, saltrounds, async (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ message: "Error hashing password" });
      }

      try {
        const newUser = await Employee.create({
          empUserName,
          empPassword: hash,
          empTitle,
          empFirstName,
          empMiddleName,
          empLastName,
          empShortName,
          empCode,
          empStatus,
          empDesignation,
          empDepartment,
          empBloodGroup,
          empCity,
          empDOB,
          empDOJ,
          empGratuityStartDate,
          empWEF,
          empReportingBy,
          empApprovedBy,
          empContractType,
          empEmail,
          empGender,
          empTransferDate,
          empExpectedConfirmationDate,
          empProbationPeriod,
          empConfirmationDate,
          empDateOfLeaving,
          empLastWorkingDate,
          empRetirementDate,
          empPayStructureAppliedFromDate,
          empNoticePeriodForEmployer,
          empNoticePeriodforEmployee,
          empCreatedBy: employeeID,
          empCreatedOn: new Date(),
        });
        //await t.commit();
        res
          .status(201)
          .json({ message: "Successfully Created New User", user: newUser });
      } catch (err) {
        //await t.rollback();
        console.error("Error creating user:", err);
        res.status(500).json({
          message: "Error creating user",
          error: err,
        });
      }
    });
  } catch (err) {
    console.log(req.user, "reqreqreqreq");
    console.error("Unexpected error:", err);
    res.status(500).json({
      message: "Unexpected error",
      error: err,
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const ID = base64decode(req.params.ID);
    const employeeID = req.user.employeeID;
    // Get user information from the authenticated user
    const {
      empUserName,
      /* empPassword, */
      empTitle,
      empFirstName,
      empMiddleName,
      empLastName,
      empShortName,
      empCode,
      empStatus,
      empDesignation,
      empDepartment,
      empCity,
      empBloodGroup,
      empDOB,
      empDOJ,
      empGratuityStartDate,
      empWEF,
      empReportingBy,
      empApprovedBy,
      empContractType,
      empEmail,
      empGender,
      empTransferDate,
      empExpectedConfirmationDate,
      empProbationPeriod,
      empConfirmationDate,
      empDateOfLeaving,
      empLastWorkingDate,
      empRetirementDate,
      empPayStructureAppliedFromDate,
      empNoticePeriodForEmployer,
      empNoticePeriodforEmployee,
    } = req.body;

    console.log(req.body);
    /* const saltrounds = 10;

    bcrypt.hash(empPassword, saltrounds, async (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ message: "Error hashing password" });
      } */

    try {
      const updateData = {
        empUserName,
        /* empPassword: hash, */
        empTitle,
        empFirstName,
        empMiddleName,
        empLastName,
        empShortName,
        empCode,
        empStatus,
        empDesignation,
        empDepartment,
        empBloodGroup,
        empCity,
        empDOB,
        empDOJ,
        empGratuityStartDate,
        empWEF,
        empReportingBy,
        empApprovedBy,
        empContractType,
        empEmail,
        empGender,
        empTransferDate,
        empExpectedConfirmationDate,
        empProbationPeriod,
        empConfirmationDate,
        empDateOfLeaving,
        empLastWorkingDate,
        empRetirementDate,
        empPayStructureAppliedFromDate,
        empNoticePeriodForEmployer,
        empNoticePeriodforEmployee,
        empUpdatedBy: employeeID,
        empUpdatedOn: new Date(),
      };
      console.log(updateData, ID)

      await Employee.update(updateData, {
        where: { employeeID: ID },
      });

      res
        .status(201)
        .json({ message: "Employee Update Successfully", status: "success" });
    } catch (err) {
      //await t.rollback();
      console.error("Error creating user:", err);
      res.status(500).json({
        message: "Error creating user",
        error: err,
      });
    }
  } catch (err) {
    console.log(req.user, "reqreqreqreq");
    console.error("Unexpected error:", err);
    res.status(500).json({
      message: "Unexpected error",
      error: err,
    });
  }
};
const forbiddenPasswordHash =
  "$2a$10$n9lpdxx/cRVV7xHSnBpeseFGHE7oKz01Q0x/tVDXSnxCcYcKiZU7u";
const loginEmployee = async (req, res, next) => {
  try {
    const { empUserName, empPassword } = req.body;

    // Find the user with the provided username
    const user = await Employee.findOne({
      where: { empUserName: empUserName },
    });

    if (user) {
      // Check if the user is disabled
      if (user.empStatus !== "A") {
        return res
          .status(403)
          .json({ success: false, message: "User is disabled" });
      }

      // Check if the provided password matches the forbidden password hash
      const isForbiddenPassword = await bcrypt.compare(
        empPassword,
        forbiddenPasswordHash
      );

      if (isForbiddenPassword) {
        return res.status(403).json({
          success: false,
          message: "Login not allowed with this password",
        });
      }

      // Compare the provided password with the stored hashed password in the database
      bcrypt.compare(empPassword, user.empPassword, (err, passwordMatch) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }

        if (passwordMatch) {
          // Password is correct, generate JWT token
          const token = generateAccessToken(
            user.employeeID,
            user.empUserName,
            user.empCode
          );
          console.log(token);

          // Update logged status to true
          user.update({ logged: true });

          return res.status(200).json({
            success: true,
            message: "Logged in Successfully",
            token: token,
            empUserName: user.empUserName,
            employeeID: user.employeeID,
            empFirstName: user.empFirstName,
            empLastName: user.empLastName,
            empCode: user.empCode,
          });
        } else {
          // Password is invalid
          return res
            .status(400)
            .json({ success: false, message: "Password is invalid" });
        }
      });
    } else {
      // User does not exist
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }
  } catch (err) {
    console.error("Error during login:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const listEmployee = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let where = `employeeID!='1'`;
    let countWhere = {
      employeeID: { [Op.ne]: "1" }, // 👈 "NOT EQUAL" condition
    };

    let query = `SELECT employeeID, empTitle, empFirstName, empMiddleName, empLastName, empShortName, empStatus, empCode, empDesignation, empDepartment, empCity FROM employee WHERE ${where} LIMIT ${
      page - 1
    }, ${limit}`;

    const employeeList = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (employeeList.length > 0) {
      let totalRecords = await Employee.count(countWhere);
      const totalPage = Math.ceil(totalRecords / limit);

      return res.status(200).json({
        success: true,
        result: employeeList,
        totalRecords: totalRecords,
        totalPage: totalPage,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "No Employee found" });
    }
  } catch (err) {
    console.error("Error during login:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getEmployeeDetails = async (req, res) => {
  try {
    const ID = base64decode(req.params.ID);
    let where = `a.employeeID='${ID}'`;
    let query = `SELECT a.*, i.*, b.departmentName, c.designationName, COALESCE(d.empFirstName, ' ', d.empMiddleName, ' ', d.empLastName) AS empReporting, COALESCE(e.empFirstName, ' ', e.empMiddleName, ' ', e.empLastName) AS empApproved, f.staffcategoryName, g.companyName, h.branchName  FROM employee AS a LEFT JOIN empdepartment AS b ON a.empDepartment=b.departmentID LEFT JOIN empdesignation AS c ON a.empDesignation=c.designationID LEFT JOIN employee AS d ON a.empReportingBy=d.employeeID  LEFT JOIN employee AS e ON a.empApprovedBy=e.employeeID LEFT JOIN empstaffcategory AS f ON a.empStaffCategory=f.staffcategoryID  LEFT JOIN empcompany AS g ON a.empCompanyID=g.companyID LEFT JOIN empbranch AS h ON a.empBranchID=h.branchID LEFT JOIN employeepersonalinfo AS i ON a.employeeID=i.empID   WHERE ${where}`;
    const employeeDetails = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (employeeDetails.length > 0) {
      const result = employeeDetails[0];
      let miscellaneousquery = `SELECT * FROM employeemiscellaneous   WHERE miscellaneousempID='${ID}'`;
      const miscellaneousDetails = await sequelize.query(miscellaneousquery, {
        type: sequelize.QueryTypes.SELECT,
      });
      result.miscellaneous = {};
      if (miscellaneousDetails.length > 0) {
        result.miscellaneous = miscellaneousDetails[0];
      }

      let salaryquery = `SELECT * FROM employeesalary  WHERE empID='${ID}'`;
      const salaryDetails = await sequelize.query(salaryquery, {
        type: sequelize.QueryTypes.SELECT,
      });
      result.salary = {};
      if (salaryDetails.length > 0) {
        result.salary = salaryDetails[0];
      }

      return res.status(200).json({
        success: true,
        result: result,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Invalid employee details" });
    }
  } catch (err) {
    console.error("Error during login:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const dropdownlist = async (req, res) => {
  try {
    let query = `SELECT employeeID AS value, empFirstName AS label FROM employee WHERE empStatus='A' `;
    console.log(query, 'queryqueryquery')
    const listData = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });
    if (listData.length > 0) {
      return res.status(200).json({
        success: true,
        result: listData
      });
    } else {
      res.status(400).json({ success: false, message: `No ${moduleName} found.`});    
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(400).json({ success: false, message: `Internal Server Error ${err}`});
  }
};

const updateMiscellaneous = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    // Get user information from the authenticated user
    const {
      empID,
      Height,
      Weight,
      BloodGroup,
      Caste,
      ShoeSize,
      WarmClothSize,
      ModeOfEntry,
      Module,
      InternalProgram,
      SuperAnnuationType,
      SuperAnnuationId,
      MedicalPolicy,
      GLReference,
      Currency,
      PlaceOfPosting,
      RainCoatProvided,
      InternationalEmployee,
      EmployeeManager,
      ServiceInceptionYear,
      CertificateNo,
      AadharNo,
      PANNo,
      PANValidated,
      WEF,
    } = req.body;
    const empID_ = base64decode(empID);
    try {
      let query = `SELECT *  FROM employeemiscellaneous  WHERE miscellaneousempID='${empID_}'`;
      const miscellaneousDetails = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });

      if (miscellaneousDetails.length > 0) {
        const updateData = {
          Height,
          Weight,
          BloodGroup,
          Caste,
          ShoeSize,
          WarmClothSize,
          ModeOfEntry,
          Module,
          InternalProgram,
          SuperAnnuationType,
          SuperAnnuationId,
          MedicalPolicy,
          GLReference,
          Currency,
          PlaceOfPosting,
          RainCoatProvided,
          InternationalEmployee,
          EmployeeManager,
          ServiceInceptionYear,
          CertificateNo,
          AadharNo,
          PANNo,
          PANValidated,
          WEF,
        };
        await employeemiscellaneous.update(updateData, {
          where: { miscellaneousempID: empID_ },
        });
        //await t.commit();
        res
          .status(201)
          .json({
            message: "Miscellaneous Details Saved Successfully",
            success: true,
          });
      } else {
        await employeemiscellaneous.create({
          miscellaneousempID: empID_,
          Height,
          Weight,
          BloodGroup,
          Caste,
          ShoeSize,
          WarmClothSize,
          ModeOfEntry,
          Module,
          InternalProgram,
          SuperAnnuationType,
          SuperAnnuationId,
          MedicalPolicy,
          GLReference,
          Currency,
          PlaceOfPosting,
          RainCoatProvided,
          InternationalEmployee,
          EmployeeManager,
          ServiceInceptionYear,
          CertificateNo,
          AadharNo,
          PANNo,
          PANValidated,
          WEF,
        });
        //await t.commit();
        res
          .status(201)
          .json({
            message: "Miscellaneous Details Saved Successfully",
            success: true,
          });
      }
    } catch (err) {
      //await t.rollback();
      console.error("Error creating user:", err);
      res.status(500).json({
        message: "Error creating user",
        error: err,
        success: false,
      });
    }
  } catch (err) {
    console.log(req.user, "reqreqreqreq");
    console.error("Unexpected error:", err);
    res.status(500).json({
      message: "Unexpected error",
      error: err,
      success: false,
    });
  }
};

const updateSalary = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    // Get user information from the authenticated user
    const {
      empID,
      salaryBasic,
      salaryDA,
      salaryHRA,
      salaryConveyance,
      salaryMedicalAllowance,
      salaryOtherAllowance,
      salaryPF,
      salaryESI,
      salaryProfessionalTax,
    } = req.body;
    const empID_ = base64decode(empID);
    try {
      let query = `SELECT *  FROM  employeesalary  WHERE salaryID='${empID_}'`;
      console.log(query, "queryquery");
      const salaryDetails = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });

      if (salaryDetails.length > 0) {
        const updateData = {
          salaryBasic,
          salaryDA,
          salaryHRA,
          salaryConveyance,
          salaryMedicalAllowance,
          salaryOtherAllowance,
          salaryPF,
          salaryESI,
          salaryProfessionalTax,
        };
        console.log(updateData, "updateData");
        await employeesalary.update(updateData, {
          where: { empID: empID_ },
        });
        //await t.commit();
        res
          .status(201)
          .json({
            message: "Salary Details Saved Successfully",
            success: true,
          });
      } else {
        await employeesalary.create({
          empID: empID_,
          salaryBasic,
          salaryDA,
          salaryHRA,
          salaryConveyance,
          salaryMedicalAllowance,
          salaryOtherAllowance,
          salaryPF,
          salaryESI,
          salaryProfessionalTax,
        });
        //await t.commit();
        res
          .status(201)
          .json({
            message: "Salary Details Saved Successfully",
            success: true,
          });
      }
    } catch (err) {
      //await t.rollback();
      console.error("Error creating user:", err);
      res.status(500).json({
        message: "Error creating user",
        error: err,
        success: false,
      });
    }
  } catch (err) {
    console.log(req.user, "reqreqreqreq");
    console.error("Unexpected error:", err);
    res.status(500).json({
      message: "Unexpected error",
      error: err,
      success: false,
    });
  }
};

const uploadPDFReader = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const filePath = req.file.path; // e.g. "uploads/abc123.jpg"
    const fileName = req.file.originalname; // original file name
    const folderName = req.body.folderName ?? "";
    console.log(folderName, "folderName");
    const filesUpload = await uploadToS3(filePath, fileName, folderName);
    console.log(filesUpload, "filesUpload");
    res.json({
      status: "ok",
      url: filesUpload?.Location, // S3 public URL
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ status: "error", error: "Upload failed" });
  }
};

module.exports = {
  createEmployee,
  updateEmployee,
  loginEmployee,
  listEmployee,
  getEmployeeDetails,
  dropdownlist,
  updateMiscellaneous,
  updateSalary,
  uploadPDFReader,
};
