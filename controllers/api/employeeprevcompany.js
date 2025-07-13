const employeeprevcompany = require("../../models/employeeprevcompany");
const sequelize = require("../../util/database");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { base64decode } = require("nodejs-base64");
const moduleName = 'Past Employment'

const list = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const name = req.query?.name ?? '';
    const status = req.query?.status ?? '';
    let employeeID = req.query?.employeeID ?? '';  
    employeeID = base64decode(employeeID);  

    let where = `prevCompID IS NOT NULL AND empID='${employeeID}'`;
    if(name!=="") {
      where+=` AND companyName LIKE '%${name}%'`;
    }
    if(status!=="") {
      where+=` AND empskillStatus='${status}'`;
    }
    let countWhere = {
      prevCompID: { [Op.ne]: null }
    };
    
    if (name !== "") {
      countWhere.companyName = {
        [Op.like]: `%${name}%`
      };
    }
    if(status!=="") {
      countWhere.designationStatus = status;
    }

    let query = `SELECT a.*, b.industryName FROM employeeprevcompany AS a LEFT JOIN empindustrymaster AS b ON a.typeOfBusiness=b.industryID WHERE ${where} ORDER BY prevCompID DESC LIMIT ${
      page - 1
    }, ${limit} `;
    console.log(query, 'qqqqqq')

    const listData = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (listData.length > 0) {
      let totalRecords = await employeeprevcompany.count(countWhere);
      const totalPage = Math.ceil(totalRecords / limit);
      return res.status(200).json({
        success: true,
        result: listData,
        totalRecords: totalRecords,
        totalPage: totalPage,
      });
    } else {
      res.status(400).json({ success: false, message: `No ${moduleName} found.`});    
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(400).json({ success: false, message: `Internal Server Error ${err}`});
  }
};


const save = async (req, res) => {
  try {
    const employeeID = req.user.employeeID;
    const request = req.body;
    const empID = base64decode(request.empID);
    console.log(empID, 'empIDempID')
    try {

      const saveData = {
        empID:empID,
        companyName:request?.companyName ?? '',
        leavingDate:request?.leavingDate,
        typeOfBusiness:request?.typeOfBusiness,
        JoiningDate:request?.JoiningDate ?? '',
        reportingToDesignation:request?.reportingToDesignation ?? '',
        department:request?.department ?? '',
        designationJoining:request?.designationJoining ?? '',
        designationLeaving:request?.designationLeaving ?? '',
        leavingReason:request?.leavingReason ?? '',
        responsibilities:request?.responsibilities ?? '',
        companyAddress:request?.companyAddress ?? '',
        achievements:request?.achievements ?? '',
        financialYear:request?.financialYear ?? '',
        lastSalaryDrawn:request?.lastSalaryDrawn ?? '',
        PFOfficeName:request?.PFOfficeName ?? '',
        PFNumber:request?.PFNumber ?? '',
        PFAmountTransfered:request?.PFAmountTransfered ?? '',
        incomeAfterExemption:request?.incomeAfterExemption ?? '',
        US80CBenefitClaimed:request?.US80CBenefitClaimed ?? '',
        standardDeductionBenefitClaimed:request?.standardDeductionBenefitClaimed ?? '',
        professionalTax:request?.professionalTax ?? '',
        TDSTaxPaid:request?.TDSTaxPaid ?? '',
        rawTax:request?.rawTax ?? '',
        surcharge:request?.surcharge ?? '',
        cess:request?.cess ?? '',
        createdBy:employeeID,
        createdOn:new Date()
      }

      if (req.file) {
        try {
          console.log(req.file, process.cwd(), "/employeedoc/prevcompany", 'req.filereq.filereq.file')
          const timestamp = new Date().toISOString().replace(/[-:.T]/g, "").slice(0, 14);
          const originalName = req.file.originalname;
          const newFileName = `${timestamp}_${originalName}`;
          const targetPath = path.join(process.cwd(), "/employeedoc/prevcompany", newFileName);
          // Write file manually to disk
          fs.writeFileSync(targetPath, req.file.buffer);
          saveData.attachment = newFileName
        } catch (err) { }
      }

      const newUser = await employeeprevcompany.create(saveData);
      if(newUser!=="") {
        res.status(200).json({ success: true, message: `The ${moduleName} has been created successfully.`});
      }else {
        res.status(400).json({ success: false, message: `Unable to create ${moduleName}. Please try again.`});        
      }      
    } catch (err) {
      console.error("Error creating user:", err);
      res.status(400).json({ success: false, message: `Unable to create ${moduleName}. Please try again.`});
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(400).json({ success: false, message: `Internal Server Error ${err}`});
  }
};


const getDetails = async (req, res) => {
  try {
    const ID = base64decode(req.params.ID);
    let where = `prevCompID='${ID}'`;
    let query = `SELECT * FROM employeeprevcompany WHERE ${where}`;
    const Details = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (Details.length > 0) {
      return res.status(200).json({
        success: true,
        result: Details[0],
      });
    } else {
      res.status(400).json({ success: false, message: `Invalid ${moduleName}`});
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(400).json({ success: false, message: `Internal Server Error ${err}`});
  }
};


const update = async (req, res) => {
  try {
    const employeeID = req.user.employeeID;
    const ID = base64decode(req.params.ID);
    const request = req.body;
    const getDetail = await employeeprevcompany.findOne({ where: { prevCompID: ID } });
    if(getDetail!==null) {
      const saveData = {
        companyName:request?.companyName ?? '',
        leavingDate:request?.leavingDate,
        typeOfBusiness:request?.typeOfBusiness,
        JoiningDate:request?.JoiningDate ?? '',
        reportingToDesignation:request?.reportingToDesignation ?? '',
        department:request?.department ?? '',
        designationJoining:request?.designationJoining ?? '',
        designationLeaving:request?.designationLeaving ?? '',
        leavingReason:request?.leavingReason ?? '',
        responsibilities:request?.responsibilities ?? '',
        companyAddress:request?.companyAddress ?? '',
        achievements:request?.achievements ?? '',
        financialYear:request?.financialYear ?? '',
        lastSalaryDrawn:request?.lastSalaryDrawn ?? '',
        PFOfficeName:request?.PFOfficeName ?? '',
        PFNumber:request?.PFNumber ?? '',
        PFAmountTransfered:request?.PFAmountTransfered ?? '',
        incomeAfterExemption:request?.incomeAfterExemption ?? '',
        US80CBenefitClaimed:request?.US80CBenefitClaimed ?? '',
        standardDeductionBenefitClaimed:request?.standardDeductionBenefitClaimed ?? '',
        professionalTax:request?.professionalTax ?? '',
        TDSTaxPaid:request?.TDSTaxPaid ?? '',
        rawTax:request?.rawTax ?? '',
        surcharge:request?.surcharge ?? '',
        cess:request?.cess ?? '',
        attachment:request?.attachment ?? '',
        updatedBy:employeeID,
        updatedOn:new Date()
      }
      if (req.file) {
        try {
          const timestamp = new Date().toISOString().replace(/[-:.T]/g, "").slice(0, 14);
          const originalName = req.file.originalname;
          const newFileName = `${timestamp}_${originalName}`;
          const targetPath = path.join(process.cwd(), "employeedoc/prevcompany", newFileName);
          // Write file manually to disk
          fs.writeFileSync(targetPath, req.file.buffer);
          saveData.attachment = newFileName
        } catch (err) { }
      }

      await employeeprevcompany.update(saveData, {
        where: { prevCompID : ID },
      });
      res.status(200).json({ success: true, message: `${moduleName} updated successfully.` });
    }else {
      res.status(400).json({ success: false, message: `Invalid ${moduleName}`});
    }
  
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(400).json({ success: false, message: `Internal Server Error ${err}`});
  }
};


const deleteData = async (req, res) => {
  try {
    const ID = base64decode(req.params.ID);
    const getDetail = await employeeprevcompany.findOne({ where: { prevCompID : ID } });
    if(getDetail!==null) {
      const deleteDetails = await employeeprevcompany.destroy({ where: { prevCompID : ID } });
      if(deleteDetails!==null) {
        res.status(200).json({ success: true, message: `${moduleName} deleted successfully.` });
      }else {
        res.status(400).json({ success: false, message: `Failed to delete ${moduleName}` });
      }
      
    }else {
      res.status(400).json({ success: false, message: `Invalid ${moduleName}`});
    }
  
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(400).json({ success: false, message: `Internal Server Error ${err}`});
  }
};


module.exports = {
  save,
  list,
  getDetails,
  update,
  deleteData
};
