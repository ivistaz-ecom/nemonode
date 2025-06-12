const employeeidentity = require("../../models/employeeidentity");
const sequelize = require("../../util/database");
const { Op } = require("sequelize");
const { base64decode } = require("nodejs-base64");
const moduleName = 'Identity'

const list = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const name = req.query?.name ?? '';
    const status = req.query?.status ?? '';
    let employeeID = req.query?.employeeID ?? '';  
    employeeID = base64decode(employeeID);  

    let where = `empidentityID IS NOT NULL AND empID='${employeeID}'`;
    if(name!=="") {
      where+=` AND IdentityNumber LIKE '%${name}%'`;
    }
    let countWhere = {
      empidentityID: { [Op.ne]: null }
    };
    if(status!=="") {
      countWhere.designationStatus = status;
    }

    let query = `SELECT a.*, b.identityName FROM employeeidentity AS a LEFT JOIN empidentity AS b ON a.identityID=b.identityID WHERE ${where} ORDER BY empidentityID DESC LIMIT ${
      page - 1
    }, ${limit} `;
  
    const listData = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (listData.length > 0) {
      let totalRecords = await employeeidentity.count(countWhere);
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
      const identityID = request?.identityID ?? '';
       let query = `SELECT b.identityName FROM employeeidentity AS a LEFT JOIN empidentity AS b ON a.identityID=b.identityID WHERE a.identityID=${identityID} AND a.empID=${empID}`;
      const Details = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
      });
      if(Details.length>0){
          res.status(400).json({ success: false, message: `${Details[0].identityName} already added.`});
          return false;
      }

      const newUser = await employeeidentity.create({
        empID:empID,
        identityID:request?.identityID ?? '',
        IdentityNumber:request?.IdentityNumber,
        IdentityName:request?.IdentityName,
        identityissueDate:request?.identityissueDate ?? '',
        identityexpiryDate:request?.identityexpiryDate ?? '',
        IdentityAttach:request?.IdentityAttach ?? '',
        IdentityVerified:request?.IdentityVerified ?? '',
        createdBy:employeeID,
        createdOn:new Date()
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
    let where = `empidentityID='${ID}'`;
    let query = `SELECT * FROM employeeidentity WHERE ${where}`;
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
    const getDetail = await employeeidentity.findOne({ where: { empidentityID: ID } });
    if(getDetail!==null) {
      const updateData = {
        identityID:request?.identityID ?? '',
        IdentityNumber:request?.IdentityNumber,
        IdentityName:request?.IdentityName,
        identityissueDate:request?.identityissueDate ?? '',
        identityexpiryDate:request?.identityexpiryDate ?? '',
        IdentityAttach:request?.IdentityAttach ?? '',
        IdentityVerified:request?.IdentityVerified ?? '',
        updatedBy:employeeID,
        updatedOn:new Date()
      }

      await employeeidentity.update(updateData, {
        where: { empidentityID : ID },
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
    const getDetail = await employeeidentity.findOne({ where: { empidentityID : ID } });
    if(getDetail!==null) {
      const deleteDetails = await employeeidentity.destroy({ where: { empidentityID : ID } });
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
