const empbranch = require("../../models/empbranch");
const bcrypt = require("bcrypt");
const sequelize = require("../../util/database");
const { Op } = require("sequelize");
const { base64decode } = require("nodejs-base64");
const moduleName = 'Branch'

const list = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const name = req.query?.name ?? '';
    const status = req.query?.status ?? '';

    

    let where = `branchID IS NOT NULL`;
    if(name!=="") {
      where+=` AND branchName LIKE '%${name}%'`;
    }
    if(status!=="") {
      where+=` AND branchStatus='${status}'`;
    }
    let countWhere = {
      branchID: { [Op.ne]: null }
    };
    
    if (name !== "") {
      countWhere.branchName = {
        [Op.like]: `%${name}%`
      };
    }
    if(status!=="") {
      countWhere.branchStatus = status;
    }

    let query = `SELECT branchID, branchName, branchStatus, companyName FROM empbranch AS a LEFT JOIN empcompany AS b ON branchCompanyID=companyID WHERE ${where} ORDER BY branchID DESC LIMIT ${
      page - 1
    }, ${limit} `;

    const listData = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (listData.length > 0) {
      let totalRecords = await empbranch.count(countWhere);
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
    const {
      branchName,
      branchCompanyID,
      branchStatus
    } = req.body;
    try {
      const newUser = await empbranch.create({
        branchName,
        branchCompanyID,
        branchStatus,
        branchCreatedBy:employeeID,
        branchCreatedOn:new Date()
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
    let where = `branchID='${ID}'`;
    let query = `SELECT a.*, b.companyName FROM empbranch AS a LEFT JOIN empcompany AS b ON a.branchCompanyID=companyID WHERE ${where}`;
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
    const getDetail = await empbranch.findOne({ where: { branchID: ID } });
    if(getDetail!==null) {
      const updateData = {
        branchName:request?.branchName ?? '',
        branchCompanyID:request?.branchCompanyID ?? '',
        branchStatus:request?.branchStatus ?? '',
        branchUpdatedBy:employeeID,
        branchUpdatedOn:new Date()
      }

      await empbranch.update(updateData, {
        where: { branchID: ID },
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
    const getDetail = await empbranch.findOne({ where: { branchID: ID } });
    if(getDetail!==null) {
      const deleteDetails = await empbranch.destroy({ where: { branchID: ID } });
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


const dropdownlist = async (req, res) => {
  try {
    const companyID = req.query?.companyID ?? '';
    let query = `SELECT branchID AS value, branchName AS label FROM empbranch WHERE branchStatus='A' AND branchCompanyID='${companyID}'`;
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


module.exports = {
  save,
  list,
  getDetails,
  update,
  deleteData,
  dropdownlist
};
