const Employee = require("../../models/employee");
const employeemiscellaneous = require("../../models/employeemiscellaneous");
const employeesalary = require("../../models/employeesalary");
const employeepersonalinfo = require("../../models/employeepersonalinfo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../../util/database");
const { Op } = require("sequelize");
const { base64decode } = require("nodejs-base64");
const fs = require("fs");
const path = require("path");
const  { format } = require("date-fns");
const { Document, Packer, Paragraph, TextRun, AlignmentType } = require("docx");

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
      empLastName,
      empShortName,
      empCode,
      empStatus,
      empDesignation,
      empDepartment,
      empCity,
      empAddress,
      empBloodGroup,
      empDOB,
      empDOJ,
      empReportingBy,
      empApprovedBy,
      empContractType,
      empEmail,
      empGender,
      empConfirmationDate,
      empDateOfLeaving,
      empLastWorkingDate,
      empPayStructureAppliedFromDate,
    } = req.body;

    console.log(req.body);
    const saltrounds = 10;

    bcrypt.hash(empPassword, saltrounds, async (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ message: "Error hashing password" });
      }

      try {
        let saveData = {
          empUserName,
          empPassword: hash,
          empTitle,
          empFirstName,
          empLastName,
          empShortName,
          empCode,
          empStatus,
          empDesignation,
          empDepartment,
          empBloodGroup,
          empCity,
          empAddress,
          empDOB,
          empDOJ,
          empReportingBy,
          empApprovedBy,
          empContractType,
          empEmail,
          empGender,
          empConfirmationDate,
          empDateOfLeaving,
          empLastWorkingDate,
          empPayStructureAppliedFromDate,
          empCreatedBy: employeeID,
          empCreatedOn: new Date(),
        }
        if (req.file) {
          try {
            const timestamp = new Date().toISOString().replace(/[-:.T]/g, "").slice(0, 14);
            const originalName = req.file.originalname;
            const newFileName = `${timestamp}_${originalName}`;
            const targetPath = path.join(process.cwd(), "employeedoc/photos", newFileName);
            // Write file manually to disk
            fs.writeFileSync(targetPath, req.file.buffer);
            saveData.empPhoto = newFileName
          } catch (err) {
          }
        }

        const newUser = await Employee.create(saveData);
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
      empLastName,
      empShortName,
      empCode,
      empStatus,
      empDesignation,
      empDepartment,
      empCity,
      empAddress,
      empBloodGroup,
      empDOB,
      empDOJ,
      empReportingBy,
      empApprovedBy,
      empContractType,
      empEmail,
      empGender,
      empConfirmationDate,
      empDateOfLeaving,
      empLastWorkingDate,
      empPayStructureAppliedFromDate,
    } = req.body;

    console.log(req.body);
    /* const saltrounds = 10;

    bcrypt.hash(empPassword, saltrounds, async (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ message: "Error hashing password" });
      } */

    try {
      let updateData = {
        empUserName,
        /* empPassword: hash, */
        empTitle,
        empFirstName,
        empLastName,
        empShortName,
        empCode,
        empStatus,
        empDesignation,
        empDepartment,
        empBloodGroup,
        empCity,
        empAddress,
        empDOB,
        empDOJ,
        empReportingBy,
        empApprovedBy,
        empContractType,
        empEmail,
        empGender,
        empConfirmationDate,
        empDateOfLeaving,
        empLastWorkingDate,
        empPayStructureAppliedFromDate,
        empUpdatedBy: employeeID,
        empUpdatedOn: new Date(),
      };
      if (req.file) {
        try {
          const timestamp = new Date().toISOString().replace(/[-:.T]/g, "").slice(0, 14);
          const originalName = req.file.originalname;
          const newFileName = `${timestamp}_${originalName}`;
          const targetPath = path.join(process.cwd(), "employeedoc/photos", newFileName);
          // Write file manually to disk
          fs.writeFileSync(targetPath, req.file.buffer);
          updateData.empPhoto = newFileName
        } catch (err) { }
      }
      console.log(updateData, ID);

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

    let query = `SELECT employeeID, CONCAT(empFirstName, ' ', empLastName) AS name, empShortName, empStatus, empCode, empDesignation, empDepartment, empCity FROM employee WHERE ${where} LIMIT ${
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
    let query = `SELECT a.*, i.*, b.departmentName, c.designationName, COALESCE(d.empFirstName, ' ', d.empLastName) AS empReporting, COALESCE(e.empFirstName, ' ', e.empLastName) AS empApproved, f.staffcategoryName, g.companyName, h.branchName  FROM employee AS a LEFT JOIN empdepartment AS b ON a.empDepartment=b.departmentID LEFT JOIN empdesignation AS c ON a.empDesignation=c.designationID LEFT JOIN employee AS d ON a.empReportingBy=d.employeeID  LEFT JOIN employee AS e ON a.empApprovedBy=e.employeeID LEFT JOIN empstaffcategory AS f ON a.empStaffCategory=f.staffcategoryID  LEFT JOIN empcompany AS g ON a.empCompanyID=g.companyID LEFT JOIN empbranch AS h ON a.empBranchID=h.branchID LEFT JOIN employeepersonalinfo AS i ON a.employeeID=i.empID   WHERE ${where}`;
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
    console.log(query, "queryqueryquery");
    const listData = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });
    if (listData.length > 0) {
      return res.status(200).json({
        success: true,
        result: listData,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: `No ${moduleName} found.` });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    res
      .status(400)
      .json({ success: false, message: `Internal Server Error ${err}` });
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
      ShoeSize,
      ShirtSize,
      TShirtSize,
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
          ShoeSize,
          ShirtSize,
          TShirtSize,
        };
        await employeemiscellaneous.update(updateData, {
          where: { miscellaneousempID: empID_ },
        });
        //await t.commit();
        res.status(201).json({
          message: "Miscellaneous Details Saved Successfully",
          success: true,
        });
      } else {
        await employeemiscellaneous.create({
          miscellaneousempID: empID_,
          Height,
          Weight,
          BloodGroup,
          ShoeSize,
          ShirtSize,
          TShirtSize,
        });
        //await t.commit();
        res.status(201).json({
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
        res.status(201).json({
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
        res.status(201).json({
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

const updatePersonalinfo = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    // Get user information from the authenticated user
    const {
      empID,
      fatherName,
      MotherName,
      maritalStatus,
      marriageDate,
      personalEmailId,
      nomineeEmail,
      religion,
      nationality,
      countryOfBirth,
      stateOfBirth,
      placeOfBirth,
      physicalDisabilities,
      disabilityRemark,
      identificationMark1,
      identificationMark2,
      extraCurricularInterest
    } = req.body;
    const empID_ = base64decode(empID);
    try {
      let query = `SELECT *  FROM  employeepersonalinfo  WHERE empID='${empID_}'`;
      console.log(query, "queryquery");
      const salaryDetails = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });

      if (salaryDetails.length > 0) {
        const updateData = {
          fatherName,
          MotherName,
          maritalStatus,
          marriageDate,
          personalEmailId,
          nomineeEmail,
          religion,
          nationality,
          countryOfBirth,
          stateOfBirth,
          placeOfBirth,
          physicalDisabilities,
          disabilityRemark,
          identificationMark1,
          identificationMark2,
          extraCurricularInterest
        };
        console.log(updateData, "updateData");
        await employeepersonalinfo.update(updateData, {
          where: { empID: empID_ },
        });
        //await t.commit();
        res.status(201).json({
          message: "Personal Info  Saved Successfully",
          success: true,
        });
      } else {
        await employeepersonalinfo.create({
          empID: empID_,
          fatherName,
          MotherName,
          maritalStatus,
          marriageDate,
          personalEmailId,
          nomineeEmail,
          religion,
          nationality,
          countryOfBirth,
          stateOfBirth,
          placeOfBirth,
          physicalDisabilities,
          disabilityRemark,
          identificationMark1,
          identificationMark2,
          extraCurricularInterest
        });
        //await t.commit();
        res.status(201).json({
          message: "Personal Info Details Saved Successfully",
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

const calculateAge = async (dob) => {
  if(dob!=="" && dob!==null && dob!=='1970-01-01') {
    const birthDate = new Date(dob); // example: "1990-06-30"
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    // If birthday hasn't occurred yet this year, subtract 1
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}

const generateAppointmentLetter = async (req, res) => {
  try {
    const employeeID = req.body.employeeID ?? "";
    const ID = base64decode(employeeID);
    let where = `a.employeeID='${ID}'`;
    let query = `SELECT CONCAT(a.empFirstName, ' ', a.empLastName) AS name, a.*, i.*, b.departmentName, c.designationName, COALESCE(d.empFirstName, ' ', d.empLastName) AS empReporting, COALESCE(e.empFirstName, ' ', e.empLastName) AS empApproved, f.staffcategoryName, g.companyName, h.branchName  FROM employee AS a LEFT JOIN empdepartment AS b ON a.empDepartment=b.departmentID LEFT JOIN empdesignation AS c ON a.empDesignation=c.designationID LEFT JOIN employee AS d ON a.empReportingBy=d.employeeID  LEFT JOIN employee AS e ON a.empApprovedBy=e.employeeID LEFT JOIN empstaffcategory AS f ON a.empStaffCategory=f.staffcategoryID  LEFT JOIN empcompany AS g ON a.empCompanyID=g.companyID LEFT JOIN empbranch AS h ON a.empBranchID=h.branchID LEFT JOIN employeepersonalinfo AS i ON a.employeeID=i.empID   WHERE ${where}`;
    const employeeDetails = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (employeeDetails.length > 0) {
      const result = employeeDetails[0];
      let  empDOJ =  result?.empDOJ ?? '';
      if(empDOJ!=="" && empDOJ!==null) {
        empDOJ= new Date(empDOJ);
      }else {
        empDOJ = new Date();
      }

      const generateDate = format(new Date(), "dd LLL y")
      
      const doc = new Document({
        styles: {
          default: {
            document: {
              run: {
                font: "Arial Narrow", // ✅ Font family
                size: 22, // ✅ 24 half-points = 12pt font size
              },
              paragraph: {
                spacing: {
                  line: 360, // ✅ Line height = 1.5 (240 = 1.0 line, 360 = 1.5)
                },
              },
            },
          },
        },
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 2000, // 3 cm
                  bottom: 1701, // 3 cm
                },
              },
            },
            children: [
              new Paragraph({
                tabStops: [
                  {
                    type: "right",
                    position: 9000, // Adjust position as needed (in twips, 1 twip = 1/20 pt)
                  },
                ],
                children: [
                  new TextRun({
                    text: `Ref: NS/001/HR/2022/AL\tDate:${generateDate}`,
                    bold: true,
                  }),
                  new TextRun({ text: `Dear ${result.empTitle}. `, break: 1 }),
                  new TextRun({
                    text: result.name,
                    bold: true,
                  }),
                  new TextRun({ text: "Welcome.", break: 1 }),
                  new TextRun({
                    text: "It gives us immense pleasure to have you as an integral part of the Nautilus team.",
                    break: 1,
                  }),
                  new TextRun({
                    text: "We are pleased to inform that you have been appointed as ",
                    break: 1,
                  }),
                  new TextRun({
                    text: `${result.designationName}`,
                    bold: true,
                  }),
                  new TextRun({
                    text: " on the following terms and conditions.",
                  }),
                  new TextRun({
                    text: "Your appointment will be effective from ",
                    break: 1,
                  }),
                  new TextRun({
                    text: `${format(empDOJ, "dd LLL y")}`,
                    bold: true,
                  }),
                  new TextRun({
                    text: "You will be paid gross emoluments as detailed in ",
                    break: 1,
                  }),
                  new TextRun({
                    text: "Annexure – A.",
                    bold: true,
                  }),
                  new TextRun({
                    text: "Your employment with us will be governed by the Terms & Conditions as detailed in Annexure – B and by the rules, regulations and policies of the company. The terms of this appointment letter shall remain confidential and are not to be disclosed to any third party.",
                    break: 1,
                  }),
                  new TextRun({
                    text: "Nautilus work ethic rests on teamwork resulting in synergies that will act as force multipliers in our effort to achieve our goals. We look forward to working with you and hope that you will find working at Nautilus a rewarding experience.",
                    break: 1,
                  }),
                  new TextRun({ text: "Thanking You,", break: 1 }),
                  new TextRun({ text: "Yours truly,", break: 1 }),
                  new TextRun({
                    text: "For Nautilus Shipping India Pvt Ltd",
                    break: 1,
                  }),
                  new TextRun({ text: "", break: 2 }),
                  new TextRun({ text: "Priyadarshini R", break: 1 }),
                  new TextRun({ text: "Manager – Admin & HR", break: 1 }),
                ],
              }),
            ],
          },
          {
            properties: {
              page: {
                margin: {
                  top: 2000, // 3 cm
                  bottom: 1701, // 3 cm
                },
              },
            },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Annexure - A:",
                    bold: true,
                    underline: true,
                  }),
                  new TextRun({
                    text: "Section-I: Administrative ",
                    break: 1,
                    bold: true,
                  }),
                  new TextRun({ break: 1 }),
                  new TextRun({
                    text: `${String.fromCharCode(97)})\tYour Position\t\t\t: ${result.designationName}`,
                    break: 1,
                  }),
                  new TextRun({
                    text: `${String.fromCharCode(
                      98
                    )})\tYou will report to\t\t\t: ${result.empReporting}`,
                    break: 1,
                  }),
                  new TextRun({
                    text: `${String.fromCharCode(99)})\tLocation\t\t\t\t: ${result.empCity}`,
                    break: 1,
                  }),
                  new TextRun({
                    text: `${String.fromCharCode(100)})\tJoining Date\t\t\t: ${format(empDOJ, "dd LLL y")}`,
                    break: 1,
                  }),
                  new TextRun({ break: 1 }),
                  new TextRun({
                    text: "Section-II: Financial Data",
                    break: 1,
                    bold: true,
                  }),
                  new TextRun({
                    text: `${String.fromCharCode(97)})\tMonthly Salary break-up`,
                    break: 1,
                  }),
                  new TextRun({
                    text: `\ti)\tBasic Pay\t\t:`,
                    break: 1,
                    bold: true,
                  }),
                  new TextRun({ text: `\tRs.` }),
                  new TextRun({ text: `\tii)\tDA\t\t\t:`, break: 1, bold: true }),
                  new TextRun({ text: `\tRs.` }),
                  new TextRun({
                    text: `\tiii)\tHRA\t\t\t:`,
                    break: 1,
                    bold: true,
                  }),
                  new TextRun({ text: `\tRs.` }),
                  new TextRun({
                    text: `\t\t\t\t\t\t-----------------`,
                    break: 1,
                  }),
                  new TextRun({ text: `\t\t\t\t\t\Total - \tRs.`, break: 1 }),
                  new TextRun({
                    text: `\t\t\t\t\t\t-----------------`,
                    break: 1,
                  }),
                  new TextRun({
                    text: `${String.fromCharCode(
                      98
                    )})\tThe Salary is subject to Income Tax deduction and other statutory levies as may be required from time to time.`,
                    break: 1,
                  }),
                  new TextRun({
                    text: `Please indicate your understanding and acceptance.`,
                    break: 1,
                  }),
                  new TextRun({
                    text: " Annexure – A ",
                    underline: true,
                  }),
                  new TextRun({
                    text: `of the above terms and conditions by signing in the space provided below.`,
                  }),
                  new TextRun({ text: `I accept.`, break: 2 }),
                  new TextRun({ break: 4 }),
                  new TextRun({ text:`${result.name}`}),
                ],
              }),
            ],
          },
          {
            properties: {
              page: {
                margin: {
                  top: 2000, // 3 cm
                  bottom: 1701, // 3 cm
                },
              },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT, // ✅ align this line right
                children: [
                  new TextRun({
                    text: "Annexure - B",
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Section-I: Company/Miscellaneous Information",
                    break: 2,
                    bold: true,
                  }),
                  new TextRun({
                    text: "1.\tProbation and Training period:",
                    break: 2,
                    bold: true,
                  }),
                  new TextRun({
                    text: "\t(i)\tYou shall be on a probation period of",
                    break: 2,
                  }),
                  new TextRun({
                    text: " ____ ",
                    bold: true,
                  }),
                  new TextRun({
                    text: "months, which shall be in two parts i.e., training and performance probation, consisting of ____ days Training and",
                  }),
                  new TextRun({
                    text: " ____ ",
                    bold: true,
                  }),
                  new TextRun({
                    text: "days of probation the date of joining the organization. Depending upon your performance during probation/training period, the management may reduce / extend the probation / training period, if required. Your services shall be confirmed upon your successful completion of the probation of the second part, In this regard, the decision of the management shall be final and binding.",
                  }),
                  new TextRun({
                    text: "\t(ii)\tAt the time of appointment or joining or thereafter, you will have to execute undertaking(s) and other documents with regard to maintaining of the organizational secrecy to protect the interest of the company.",
                    break: 1,
                  }),
                  new TextRun({
                    text: "2.\tTarget Achievement:",
                    break: 2,
                    bold: true,
                  }),
                  new TextRun({
                    text: "\tYou have to meet the monthly/quarterly target as assigned to you by your department head/Company from time to time. In case of non - fulfilment of the target at any time during the tenure of your service, it will be the discretionary power of the management to terminate your job. You shall diligently and faithfully carry out any responsibility, which may be assigned to you time to time to ensure results. You will be expected to work extra hours to achieve the set targets, whenever the job so requires.",
                    break: 1,
                  }),
                  new TextRun({
                    text: "3.\tReview of Salary:",
                    break: 2,
                    bold: true,
                  }),
                  new TextRun({
                    text: "\tYour performance will be reviewed in the month of June of every financial year according to our appraisal cycle. Increments and promotions are given solely based on your performance, behaviour, discipline, attitude, competence & achievements etc..",
                    break: 1,
                  }),
                  new TextRun({
                    text: "4.\tReporting Time and Punctuality:",
                    break: 2,
                    bold: true,
                  }),
                  new TextRun({
                    text: "\tYour office time will be as per the norms of the company, which will be subject to change from time to time. For availing any leave, you will have to obtain a prior sanction justifying the need for the said leave; any violation on this account may be inviting a penal deduction of an amount equivalent to two working day salary for each and every leave, so availed. You are entitled to take leave as per the leave policy of the Company.",
                    break: 1,
                  }),
                  new TextRun({
                    text: "5.\tNon-Divulgence of Company’s Business Information:",
                    break: 2,
                    bold: true,
                  }),
                  new TextRun({
                    text: "\tYou will not divulge or part with any information regarding the business of the company to anyone during the tenure of your employment with the company",
                    break: 1,
                  }),
                  new TextRun({
                    text: "6.\tTransfer:",
                    break: 2,
                    bold: true,
                  }),
                  new TextRun({
                    text: "\tYour services are transferable to any department / locations of the company at the discretion of the management.",
                    break: 1,
                  }),
                  new TextRun({
                    text: "7.\tTermination of Service",
                    break: 2,
                    bold: true,
                  }),
                  new TextRun({
                    text: "\t(i)\tIf particulars furnished by you in your application / personal data form or during the interview, or later during the tenure of your service in the organization as the case may be, are subsequently found to be incorrect ",
                    break: 1,
                  }),
                  new TextRun({
                    text: "\t(ii)\tIf you are found guilty of misconduct, disobedience, inefficiency, misappropriation misrepresentation, insubordination and or beach or any of the terms and conditions of your appointment and also of the rules and regulations of the organization as enforce from time to time.",
                    break: 1,
                  }),
                  new TextRun({
                    text: "\t(iii)\tIn case you remain absent for five days continuously including holiday or overstay the sanctioned leave for three days under any circumstances. In such a case, it would be deemed that you have abandoned your job and will have no claim to reinstatement and/or any compensation thereof.",
                    break: 1,
                  }),
                  new TextRun({
                    text: "\t(iv)\tDuring this probation period, you are required to give a notice period of 15 days, in the event of your resigning from the services of the company. However, the notice period will be 30 days after confirmation. Further, this employment can be terminated by Nautilus by serving you either a 15 days’ notice or 15 day’s Salary in lieu of notice.",
                    break: 1,
                  }),
                  new TextRun({
                    text: "\t(v)\tNotwithstanding clause iv above, if you violate any of these conditions or under performs consistently or does not perform to the satisfaction of company or acts against the interest of company himself or does not conform to rules of the establishment where you are posted, company has got all rights to terminate your services immediately after giving proper reason and the requirement of notice period by company shall not apply.",
                    break: 1,
                  }),
                  new TextRun({
                    text: "\t(vi)\tIn the event of your resignation/termination, you will immediately give up to the Company before you are relieved, all correspondence, specifications, books, documents, data or records etc., belonging to the Company or relating to its business and shall not make or retain any copies of these items.",
                    break: 1,
                  }),
                  new TextRun({
                    text: "8.\tGeneral",
                    break: 2,
                    bold: true,
                  }),
                  new TextRun({
                    text: "\tYou shall be subject to the various rules, regulations, administrative policies and other policies of the company, which are time being in force or shall be formed and enforced from time to time. The management has absolute power and right to cease or to modify / review the regulations and the said policies from time to time with or without intimation to you.",
                    break: 2,
                  }),
                  new TextRun({
                    text: "Please indicate your understanding and acceptance Annexure – B of the above terms and conditions by signing in the space provided below.",
                    break: 2,
                  }),
                  new TextRun({
                    text: "I accept.",
                    break: 2,
                  }),
                  new TextRun({
                    text: `${result.name}`,
                    break: 4,
                    bold: true,
                  }),
                ],
              }),
            ],
          },
        ],
      });

      // Save to file
      await Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync("./employeedoc/Appointment Letter.docx", buffer);
        console.log("Document created successfully!");
      });
      res.json({
        status: "ok",
        fileName: `Appointment Letter.docx`,
      });
    }else {
      res.status(400).json({ status: "error", error: "Invalid Employee" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ status: "error", error: "Upload failed" });
  }
};

const generateConfidentiality = async (req, res) => {
  try {
    const employeeID = req.body.employeeID ?? "";
    const ID = base64decode(employeeID);
    let where = `a.employeeID='${ID}'`;
    let query = `SELECT CONCAT(a.empFirstName, ' ', a.empLastName) AS name, a.*, i.*, b.departmentName, c.designationName, COALESCE(d.empFirstName, ' ', d.empLastName) AS empReporting, COALESCE(e.empFirstName, ' ', e.empLastName) AS empApproved, f.staffcategoryName, g.companyName, h.branchName  FROM employee AS a LEFT JOIN empdepartment AS b ON a.empDepartment=b.departmentID LEFT JOIN empdesignation AS c ON a.empDesignation=c.designationID LEFT JOIN employee AS d ON a.empReportingBy=d.employeeID  LEFT JOIN employee AS e ON a.empApprovedBy=e.employeeID LEFT JOIN empstaffcategory AS f ON a.empStaffCategory=f.staffcategoryID  LEFT JOIN empcompany AS g ON a.empCompanyID=g.companyID LEFT JOIN empbranch AS h ON a.empBranchID=h.branchID LEFT JOIN employeepersonalinfo AS i ON a.employeeID=i.empID   WHERE ${where}`;
    const employeeDetails = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (employeeDetails.length > 0) {
      const result = employeeDetails[0];
      const famlySQL = `SELECT familyName FROM employeefamily WHERE (familyRelation='Father' OR familyRelation='Mother') AND familyEmpID='${result.employeeID}' `;
      const familyDetails = await sequelize.query(famlySQL, {
        type: sequelize.QueryTypes.SELECT,
      });
      let fatherName = '';
      if(familyDetails.length>0) {
        fatherName = familyDetails[0].familyName;
      }

     
      const generateDate = format(new Date(), "dd LLL y")
      const doc = new Document({
        styles: {
          default: {
            document: {
              run: {
                font: "Arial Narrow",
                size: 20,
              },
              paragraph: {
                spacing: {
                  line: 360,
                },
              },
            },
          },
        },
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 2000,
                  bottom: 1701,
                },
              },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "EMPLOYEE CONFIDENTIALITY AND NON-COMPETITION AGREEMENT",
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: `THIS AGREEMENT dated as of the ${generateDate} by and between `,
                  }),
                  new TextRun({
                    text: "Nautilus Shipping India Pvt. Ltd., ",
                    bold: true,
                  }),
                  new TextRun({
                    text: `based at 1st Floor, Maalavika Centre, 144, Kodambakkam High Road, Nungambakkam, Chennai 600034 (the "Company"), and `,
                  }),
                  new TextRun({
                    text: `${result.name}`,
                    bold: true,
                  }),
                  new TextRun({
                    text: " daughter/son of ",
                  }),
                  new TextRun({
                    text: `${fatherName}`,
                    bold: true,
                  }),
                  new TextRun({
                    text: ", aged about",
                  }),
                  new TextRun({
                    text: ` ${await calculateAge(result.empDOB)}`,
                    bold: true,
                  }),
                  new TextRun({
                    text: " years, currently residing at “",
                  }),
                  new TextRun({
                    text: `${result.empAddress}`,
                    bold: true,
                  }),
                  new TextRun({
                    text: "”.",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "WITNESSETH THAT:",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "\tWHEREAS, the Company is engaged in the business of recruitment and placement of personnel, providing management solutions and other related services to the Shipping Industry.",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "\tWHEREAS, in its business the Company has, acquired and uses information and details that will continue to develop, acquire and use commercially valuable information which is vital to the Company's business and which must, to retain its value to the Company, be held by the Company and its personnel as secret; and ",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "\tWHEREAS, the Employee desires to be employed by the Company, and acknowledges that through such employment he/she may become and acquainted with such information and may contribute thereto through his own improvements, developments and other work in his capacity as an employee of the Company; and",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "\tWHEREAS, the Employee wishes his/her employment by the Company to continue; desires to be considered for promotion, raises and bonuses; and hopes to be given an opportunity to expand his areas of responsibility within the Company;",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "NOW, THEREFORE, in consideration of the premises set forth above, and for other good and valuable consideration the receipt and sufficiency of which are hereby acknowledged, the parties hereto, intending to be legally bound, hereby agree under seal as follows:",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "1.\tEmployee Acknowledgements. The Employee acknowledges that through his employment with the Company he/she may become and acquainted with Confidential Information and may contribute thereto through his own improvements, developments and other work in his capacity as an employee of the Company. The Employee further acknowledges that through his employment, he/she is likely to develop relationships with valued customers, corporate partners and/or business contacts of the Company and knowledge concerning the identity and needs of such persons and entities. The Employee acknowledges that the Confidential Information is commercially valuable information which is vital to the Company's business and which must, to retain its value to the Company, be held by the Company and its personnel as secret. The Employee also acknowledges that he/she will, during the course of his/her employment, receive information of the nature of Confidential Information, belonging to clients of the Company (“Client Confidential Information”) and the Employee undertakes to maintain confidentiality of the Client Confidential Information.",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: `2.\tConfidential Information. The Employee acknowledges that the Company possesses and will continue to acquire and possess information that has been created, discovered, developed or otherwise become known to the Company (including without limitation information created, discovered, developed or otherwise made known by the Employee during the period of or arising out of his employment by the Company) or in which property rights have been assigned or otherwise conveyed to the Company, which information has commercial value in the business in which the Company is engaged, and which gives the Company an opportunity to obtain an advantage over its competitors who do not know or use it. All such information, including all materials and media containing such information, except such information as is known or becomes known to the public without violation of the terms of this Agreement and/or which is common to the trade or profession of the Employee, is hereinafter referred to as "Confidential Information." By way of illustration, but not limitation, Confidential Information includes the Company's lists of customers, potential customers, and sources of customers; lists of corporate partners; mailing lists; the terms of any agreements that the Company may have with customers, corporate partners, lenders, vendors, employees, consultants, other entities in the same business as or a similar business to that of the Company, and other parties; the identity and location of the Company's business contacts; the Company's patent applications, computer programs (whether in object code, source code or otherwise), flow charts, manuals, program documentation, and trade secrets, processes, data, know-how, improvements, discoveries, developments, designs, inventions, techniques, marketing plans, strategies, forecasts, new products, unpublished financial statements, budgets, projections, licenses, prices, costs, sales and supplier lists, and all materials and media containing any or all of such information, whether or not labeled and identified as confidential or proprietary.`,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "3.\tNon-Disclosure of Confidential Information and Client Confidential Information. Unless the Employee shall first secure the Company's written consent, the Employee shall not disclose or use at any time either during or subsequent to his employment any Confidential Information or Client Confidential Information of which the Employee becomes informed during his employment, whether or not developed by the employee, except as required in the Employee's duties to the Company. The Employee shall use his best efforts and utmost diligence to protect the Confidential Information and Client Confidential Information from misuse, misappropriation, theft, loss or unauthorized disclosure.",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: `4.\tDisclosure of Developments. The Employee shall disclose promptly to the Company or its nominee any and all inventions, discoveries, developments and improvements that are conceived, devised, invented, developed, made or reduced to practice or tangible medium by the Employee, under the Employee's direction or jointly by the Employee and others, during the period of employment (whether or not during normal working hours or on the premises of the Company) and related to the business or activities of the Company (collectively, "Inventions"), and hereby assigns and agrees to assign all his right, title and interest in the Inventions to the Company. Whenever requested to do so by the Company, the Employee shall execute any and all applications, assignments or other instruments or documents, which the Company shall deem necessary or desirable to obtain patent or copyright protection or otherwise to protect the Company's interest in the Inventions, and shall otherwise cooperate with the Company, at the Company's expense, in obtaining patent or other proprietary protection for the Inventions. The Employee hereby irrevocably appoints the Company his attorney-in-fact to execute and deliver any such instruments and documents on the Employee's behalf in the event that the Employee should fail or refuse to do so within a reasonable period of time following the Company's request. These obligations shall continue beyond the termination of employment with respect to inventions, discoveries, developments and improvements conceived or made by the Employee during the period of employment, and shall be binding upon the Employee's assigns, executors, administrators and other legal representatives.`,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "5.\tReturn of Documents and Materials. Upon termination of said employment, the Employee shall promptly deliver to the Company all physical embodiments of Confidential Information and Client Confidential Information, including without limitation all lists (whether of customers, business contacts, or otherwise), agreements, notes, letters, notebooks, reports, manuals, compilations, accounts, drawings, blueprints, Software CD’s and all other materials of a secret or confidential nature relating to the Company's business which are in the possession or under the control of the Employee, whether recorded on paper, film, videotape, audiotape, computer disk or other media. The Employee shall deliver to the Company both the original and all copies of such materials, retaining no original or copy or part thereof for himself/herself. These obligations shall be binding upon the Employee's assigns, executors, administrators and other legal representatives.",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "6.\tPast Employers' confidential information. The Employee represents that he/she has not brought and will not bring with him/her to the Company or use in the performance of his responsibilities at the Company any materials or documents of a former employer that are not generally available to the public, unless he/she has obtained written authorization from the former employer for their repossession and use. The Employee also understands that, in his employment with the Company, he/she is not to commit a breach of any obligations of confidentiality that he/she has to former employers, and agrees that he/she shall fulfil all such obligations during his employment with the Company.",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "7.\tNo Breach of Prior Agreement. The Employee represents and warrants that his performance of the terms of this Agreement and performance of his duties as an employee of the Company do not and will not constitute a breach of any agreement to keep in confidence information acquired by him/her in confidence or in trust prior to his employment by the Company or any agreement not to compete against any former employer of the Employee. The Employee further represents and warrants that he/she has not entered into, and agrees that he/she will not enter into, any agreement, either written or oral, in conflict with this Agreement.",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "8.\tNo Competition. While the Employee is employed by the Company and for a period of one (1) year after the termination or cessation of such employment for any reason, the Employee shall not directly or indirectly:",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "\t(a)\tas an individual proprietor, partner, stockholder, officer, employee, director, joint venture, investor, lender, consultant, or in any other capacity whatsoever (other than (i) in his capacity as an employee of the Company and (ii) as the passive holder of not more than one percent (1%) of the total outstanding stock of a publicly held company), engage in a business similar to or competitive with that of the Company, or otherwise compete, directly or indirectly, with the Company; or",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "\t(b)\trecruit , solicit or induce, or attempt to induce, any employee or other agent of the Company, or any consultant to the Company or other person or entity having an independent contractor relationship with the Company, to terminate his employment or agency, or otherwise cease his relationship, with the Company; or",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "\t(c)\tsolicit (other than in his capacity as an employee of the Company), divert or take away, or attempt to divert or to take away, the business or patronage of any of the customers or prospective customers, and any of the corporate partners or potential corporate partners of the Company, including, without limitation, any customer or corporate partner who does or did business with the Company at any time during the Employee's employment with the Company, or otherwise contact any customer or corporate partner who does or did business with the Company during such period, for any purpose competitive with the business of the Company.",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "9.\tConstruction of Non-Competition Covenant. If any restriction set forth in paragraph 7 is found by any court of competent jurisdiction to be unenforceable because it extends for too long a period of time or over too great a range of activities or in too broad a geographic area, it shall be interpreted to extend only over the maximum period of time, range of activities or geographic area as to which it may be enforceable.",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "10.\tNotice of Subsequent Employment. The Employee shall, for a period of one (1) year after the termination or cessation of his employment with the Company for any reason, notify the Company of any change of address, and of any subsequent employment (stating the name and address of the employer and the nature of the position) or any other business activity. During such period, the Employee further agrees to provide any subsequent employer with a copy of this Agreement.",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "11.\tSeverability. The invalidity or unenforceability of any provision of this Agreement shall not affect the validity or enforceability of any other provision of this Agreement.",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "12.\tWaiver. No delay or omission by the Company in exercising any right under this Agreement will operate as a waiver of that or any other right. A waiver or consent given by the Company on any one occasion is effective only in that instance and will not be construed as a bar to or waiver of any right on any other occasion.",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "13.\tInjunctive Relief. The restrictions contained in this Agreement are necessary for the protection of the business and good will of the Company and are considered by the Employee to be reasonable for such purpose. The Employee agrees that any breach of this Agreement will cause the Company substantial and irreparable damage for which no adequate remedy at law exists, and that therefore, in the event of any such breach, in addition to such other remedies as may be available, the Company shall have the right to seek and obtain specific performance and injunctive relief from any court of competent jurisdiction.",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "14.\tNature of Employment. Nothing contained herein is intended to or shall be construed to create a right on the part of the Employee to employment by the Company or a right on the part of the Company to the Employee's services for any period of time.",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "15.\tGoverning Law. This Agreement constitutes and shall be construed as a sealed instrument and shall in all events and for all purposes be governed by and construed in accordance with the substantive law of the India without regard to any choice of law or conflicts of laws principles which could dictate the application of the laws of another jurisdiction. Any action, suit or other legal proceeding which the Employee may commence in order to resolve any matter arising under or relating to any provision of this Agreement shall be commenced only in a court of competent jurisdiction in Bangalore, and the Employee hereby consents to the jurisdiction of such court with respect to any action, suit or proceeding commenced in such court by the Company.",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "16.\tEntire Agreement; Modification; Counterparts. This Agreement sets forth the entire understanding and agreement between the parties concerning the subject matter hereof, superseding all prior agreements. There are no agreements, contracts, or understandings by or between the parties concerning the subject matter hereof other than those set forth expressly herein. Neither party has made or relied on any representations concerning the subject matter of this Agreement other than those expressly set forth herein. This Agreement may not be modified or amended in any manner other than by a writing executed by or on behalf of each of the parties hereto. This Agreement may be executed in counterparts.",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "17.\tAssignment. This Agreement may be assigned by the Company in connection with any sale of all or substantially all of the assets of the Company or any similar transaction. The Employee may not assign this Agreement.",
                  }),
                  new TextRun({
                    text: "18.\tAttorneys' Fees. In the event that the Company commences legal proceedings to enforce this Agreement or any of the terms hereof and judgment is entered for the Company therein, the Company shall recover of the Employee its reasonable expenses so incurred, including, without limitation, reasonable attorneys' fees and court costs. Without limiting the generality of the foregoing, the Company shall be entitled to recover its said expenses if it obtains any injunctive relief hereunder and/or a declaratory judgment that the conduct or threatened conduct of the Employee constitutes a violation of any term of this Agreement. This paragraph is not intended to, and shall not be construed to, entitle either party to recover any expenses, including reasonable attorneys' fees, in connection with any claims or counterclaims unrelated to this Agreement.",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "19.\tNotices. Any notices which shall or may be given under this Agreement to either party shall be given by hand or by first class mail, postage prepaid, to such party at the addresses set forth above for such party, or at such other address as such party may fix by written notice.",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: `20.\tTerms, Captions. As used herein, the masculine gender shall mean and include the feminine and neutral genders; the singular shall mean and include the plural and the plural shall mean and include the singular; and "and” and "or" shall each, if the context permits, mean and include "and/or." The captions used herein are for convenience only, form no part of this Agreement and shall not affect the construction hereof.`,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "IN WITNESS WHEREOF the parties have set their hands and seals and have executed and delivered this Agreement as of the first date written above.",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "EMPLOYEE\t\t\t\t\t\t\tEMPLOYER",
                    break: 4,
                  }),
                  new TextRun({
                    text: `${result.name}\t\t\t\t\tfor Nautilus Shipping India Pvt Ltd`,
                    break: 5,
                    bold: true,
                  }),
                ],
              }),
            ],
          },
        ],
      });

      // Save to file
      await Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync("./employeedoc/Confidentiality.docx", buffer);
        console.log("Document created successfully!");
      });
      res.json({
        status: "ok",
        fileName: `Confidentiality.docx`,
      });
    }else {
      res.status(400).json({ status: "error", error: "Invalid Employee" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ status: "error", error: "Upload failed" });
  }
};

const generateConfirmationLetter = async (req, res) => {
  try {
    const employeeID = req.body.employeeID ?? "";
    const ID = base64decode(employeeID);
    let where = `a.employeeID='${ID}'`;
    
    let query = `SELECT CONCAT(a.empFirstName, ' ', a.empLastName) AS name, a.*, i.*, b.departmentName, c.designationName, COALESCE(d.empFirstName, ' ', d.empLastName) AS empReporting, COALESCE(e.empFirstName, ' ', e.empLastName) AS empApproved, f.staffcategoryName, g.companyName, h.branchName  FROM employee AS a LEFT JOIN empdepartment AS b ON a.empDepartment=b.departmentID LEFT JOIN empdesignation AS c ON a.empDesignation=c.designationID LEFT JOIN employee AS d ON a.empReportingBy=d.employeeID  LEFT JOIN employee AS e ON a.empApprovedBy=e.employeeID LEFT JOIN empstaffcategory AS f ON a.empStaffCategory=f.staffcategoryID  LEFT JOIN empcompany AS g ON a.empCompanyID=g.companyID LEFT JOIN empbranch AS h ON a.empBranchID=h.branchID LEFT JOIN employeepersonalinfo AS i ON a.employeeID=i.empID   WHERE ${where}`;
    const employeeDetails = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (employeeDetails.length > 0) {
      const result = employeeDetails[0];
      let  empDOJ =  result?.empDOJ ?? '';
      if(empDOJ!=="" && empDOJ!==null) {
        empDOJ= new Date(empDOJ);
      }else {
        empDOJ = new Date();
      }
     
      const generateDate = format(new Date(), "dd LLL y");
      const doc = new Document({
        styles: {
          default: {
            document: {
              run: {
                font: "Calibri (Body)", // ✅ Font family
                size: 22, // ✅ 24 half-points = 12pt font size
              },
              paragraph: {
                spacing: {
                  line: 360, // ✅ Line height = 1.5 (240 = 1.0 line, 360 = 1.5)
                },
              },
            },
          },
        },
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 2000, // 3 cm
                  bottom: 1701, // 3 cm
                },
              },
            },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Ref: NS/001/HR/2022/CL",
                    bold: true,
                  }),
                  new TextRun({ text: "Date: ", break: 1 }),
                  new TextRun({
                    text: `${format(empDOJ, "dd LLL y")}`,
                    bold: true,
                  }),
                  new TextRun({ text: "Place:.", break: 1 }),
                  new TextRun({
                    text: `${result.branchName}`,
                    bold: true,
                  }),
                  new TextRun({ text: "Dear ", break: 2 }),
                  new TextRun({
                    text: `${result.name}`,
                    bold: true,
                  }),
                  new TextRun({
                    text: ",",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: `We are delighted to inform you that after a careful review, the management has found your performance thus far to meet the rigorous expectations that the position you are now fulfilling demands. On that basis, we are extending an offer of confirmation with effect from ${format(empDOJ, "dd LLL y")}. All other terms and conditions agreed in the appointment letter remain the same. In this connection, we expect the highest standards from you now and a further and steady improvement in future. Your work will periodically be assessed.`,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "By accepting this confirmation letter, you are reaffirming your commitment to all other details spelled out in the Appointment Letter, including absolute confidentiality about this company, your responsibilities, our services, and all client information.",
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "We congratulate you on your achievement and it is our sincere hope that you will continue to reach the pinnacles of your career, here at Nautilus Shipping. ",
                  }),
                ],
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "Sincerely,",
                    break: 1,
                  }),
                  new TextRun({
                    text: "AUTHORIZED SIGNATORY,",
                    break: 4,
                  }),
                  new TextRun({
                    text: "DESIGNATION",
                    break: 1,
                  }),
                ],
              }),
            ],
          },
        ],
      });

      // Save to file
      await Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync("./employeedoc/Confirmation Letter.docx", buffer);
        console.log("Document created successfully!");
      });
      res.json({
        status: "ok",
        fileName: `Confirmation Letter.docx`,
      });
    }else {
      res.status(400).json({ status: "error", error: "Invalid Employee" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ status: "error", error: "Upload failed" });
  }
};

const generateOfferLetter = async (req, res) => {
  try {
    const employeeID = req.body.employeeID ?? "";
    const ID = base64decode(employeeID);
    let where = `a.employeeID='${ID}'`;
    
    let query = `SELECT CONCAT(a.empFirstName, ' ', a.empLastName) AS name, a.*, i.*, b.departmentName, c.designationName, COALESCE(d.empFirstName, ' ', d.empLastName) AS empReporting, COALESCE(e.empFirstName, ' ', e.empLastName) AS empApproved, f.staffcategoryName, g.companyName, h.branchName  FROM employee AS a LEFT JOIN empdepartment AS b ON a.empDepartment=b.departmentID LEFT JOIN empdesignation AS c ON a.empDesignation=c.designationID LEFT JOIN employee AS d ON a.empReportingBy=d.employeeID  LEFT JOIN employee AS e ON a.empApprovedBy=e.employeeID LEFT JOIN empstaffcategory AS f ON a.empStaffCategory=f.staffcategoryID  LEFT JOIN empcompany AS g ON a.empCompanyID=g.companyID LEFT JOIN empbranch AS h ON a.empBranchID=h.branchID LEFT JOIN employeepersonalinfo AS i ON a.employeeID=i.empID   WHERE ${where}`;
    const employeeDetails = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (employeeDetails.length > 0) {
      const result = employeeDetails[0];
      let  empDOJ =  result?.empDOJ ?? '';
      if(empDOJ!=="" && empDOJ!==null) {
        empDOJ= new Date(empDOJ);
      }else {
        empDOJ = new Date();
      }
      const empAddress = result?.empAddress ?? ''; 
       const addressRuns = (empAddress!=="" && empAddress!==null)?result?.empAddress.split('\n').map((line, index) => {
        return new TextRun({
          text: line,
          bold: true,
          break: index === 0 ? undefined : 1,
        });
      }):'';
     
      const generateDate = format(new Date(), "dd LLL y");
      const doc = new Document({
        styles: {
          default: {
            document: {
              run: {
                font: "Arial Narrow", // ✅ Font family
                size: 22, // ✅ 24 half-points = 12pt font size
              },
              paragraph: {
                spacing: {
                  line: 360, // ✅ Line height = 1.5 (240 = 1.0 line, 360 = 1.5)
                },
              },
            },
          },
        },
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 2000, // 3 cm
                  bottom: 1701, // 3 cm
                },
              },
            },
            children: [
              new Paragraph({
                tabStops: [
                  {
                    type: "right",
                    position: 9000, // Adjust position as needed (in twips, 1 twip = 1/20 pt)
                  },
                ],
                children: [
                  new TextRun({
                    text: `\t${generateDate}`,
                    bold: true,
                  }),
                  new TextRun({ text: "To,", break: 1, bold: true }),
                  new TextRun({
                    text: `${result.name},`,
                    bold: true,
                    break: 1,
                  })
                ]
              }),
               new Paragraph({
                children:addressRuns
               }),              
              new Paragraph({
                children: [
                  new TextRun({ text: "Sub: Letter of Intent", break: 2 }),
                  new TextRun({
                    text: `Dear ${result.name},`,
                    break: 2,
                  }),
                  new TextRun({
                    text: "This has reference to your application and the subsequent interview at our",
                    break: 1,
                  }),
                  new TextRun({
                    text: ` ${result.branchName} `,
                    bold: true,
                  }),
                  new TextRun({
                    text: "office.",
                  }),
                  new TextRun({
                    text: "We are pleased to offer you an appointment with us as",
                    break: 2,
                  }),
                  new TextRun({
                    text: ` ${result.designationName} `,
                    bold: true,
                  }),
                  new TextRun({
                    text: "on a monthly salary of gross",
                    break: 2,
                  }),
                  new TextRun({
                    text: " Rs. XXX/- (Rupees ---------------------Only).",
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    break: 1,
                  }),
                  new TextRun({
                    text: "This is a letter of intent. A formal appointment letter stating the terms of your employment will be handed over to you when you join. A detailed job description and company policies will be discussed with you upon joining.",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    break: 1,
                  }),
                  new TextRun({
                    text: "Please sign the duplicate copy of the letter as a token of your acceptance and return it to us for office records. You are requested to bring original copy of your testimonials, three recent coloured passport size photographs, relieving letter, Salary slip, id proof and address proof and signed copy of this intent letter at the time of joining.",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "Yours faithfully,",
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "for ",
                    break: 1,
                  }),
                  new TextRun({
                    text: "Nautilus Shipping India Pvt. Ltd.",
                    bold: true,
                  }),
                  new TextRun({ text: "Yours truly,", break: 4 }),
                  new TextRun({
                    text: "Priyadarshini R",
                    break: 1,
                  }),
                  new TextRun({ text: "Manager – HR & Admin", break: 1 }),
                ],
              }),
            ],
          },
        ],
      });

      // Save to file
      await Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync("./employeedoc/Offer Letter.docx", buffer);
        console.log("Document created successfully!");
      });
      res.json({
        status: "ok",
        fileName: `Offer Letter.docx`,
      });
    }else {
      res.status(400).json({ status: "error", error: "Invalid Employee" });
    }
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
  updatePersonalinfo,
  uploadPDFReader,
  generateAppointmentLetter,
  generateConfidentiality,
  generateConfirmationLetter,
  generateOfferLetter,
};
