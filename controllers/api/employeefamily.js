const employeefamily = require("../../models/employeefamily");
const sequelize = require("../../util/database");
const { Op } = require("sequelize");
const { base64decode } = require("nodejs-base64");
const moduleName = 'Family Details'

const list = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const name = req.query?.name ?? '';
    let employeeID = req.query?.employeeID ?? '';  
    employeeID = base64decode(employeeID);  

    let where = `familyID IS NOT NULL AND familyEmpID='${employeeID}'`;
    if(name!=="") {
      where+=` AND familyName LIKE '%${name}%'`;
    }
    let countWhere = {
      familyID: { [Op.ne]: null }
    };
    
    if (name !== "") {
      countWhere.familyName = {
        [Op.like]: `%${name}%`
      };
    }


    let query = `SELECT * FROM employeefamily WHERE ${where} ORDER BY familyID DESC LIMIT ${
      page - 1
    }, ${limit} `;
   
    const listData = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (listData.length > 0) {
      let totalRecords = await employeefamily.count(countWhere);
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
    try {
      const newUser = await employeefamily.create({
        familyEmpID:empID,
        familyIsDependent:request?.familyIsDependent ?? '',
        familyTitle:request?.familyTitle,
        familyName:request?.familyName ?? '',
        familyGender:request?.familyGender ?? '',
        familyRelation:request?.familyRelation ?? '',
        familyAddress:request?.familyAddress ?? '',
        familyBloodGroup:request?.familyBloodGroup ?? '',
        familyContactNo:request?.familyContactNo ?? '',
        familyDOB:request?.familyDOB ?? '',
        familyMaritalStatus:request?.familyMaritalStatus ?? '',
        familyMarriageDate:request?.familyMarriageDate ?? '',
        familyEmployment:request?.familyEmployment ?? '',
        familyProfession:request?.familyProfession ?? '',
        familyNationality:request?.familyNationality ?? '',
        familyInsuranceNumber:request?.familyInsuranceNumber ?? '',
        familyRemarks:request?.familyRemarks ?? '',
        familyAttachment:request?.familyAttachment ?? '',      
        familycreatedBy:employeeID,
        familycreatedOn:new Date()
      });
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
    let where = `familyID='${ID}'`;
    let query = `SELECT * FROM employeefamily WHERE ${where}`;
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
    const getDetail = await employeefamily.findOne({ where: { familyID: ID } });
    if(getDetail!==null) {
      const updateData = {
        familyIsDependent:request?.familyIsDependent ?? '',
        familyTitle:request?.familyTitle,
        familyName:request?.familyName ?? '',
        familyGender:request?.familyGender ?? '',
        familyRelation:request?.familyRelation ?? '',
        familyAddress:request?.familyAddress ?? '',
        familyBloodGroup:request?.familyBloodGroup ?? '',
        familyContactNo:request?.familyContactNo ?? '',
        familyDOB:request?.familyDOB ?? '',
        familyMaritalStatus:request?.familyMaritalStatus ?? '',
        familyMarriageDate:request?.familyMarriageDate ?? '',
        familyEmployment:request?.familyEmployment ?? '',
        familyProfession:request?.familyProfession ?? '',
        familyNationality:request?.familyNationality ?? '',
        familyInsuranceNumber:request?.familyInsuranceNumber ?? '',
        familyRemarks:request?.familyRemarks ?? '',
        familyAttachment:request?.familyAttachment ?? '',
        familyupdatedBy:employeeID,
        familyupdatedOn:new Date()
      }

      await employeefamily.update(updateData, {
        where: { familyID : ID },
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
    const getDetail = await employeefamily.findOne({ where: { familyID : ID } });
    if(getDetail!==null) {
      const deleteDetails = await employeefamily.destroy({ where: { familyID : ID } });
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
