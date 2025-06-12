const empidentity = require("../../models/empidentity");
const bcrypt = require("bcrypt");
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

    

    let where = `identityID IS NOT NULL`;
    if(name!=="") {
      where+=` AND identityName LIKE '%${name}%'`;
    }
    if(status!=="") {
      where+=` AND identityStatus='${status}'`;
    }
    let countWhere = {
      identityID: { [Op.ne]: null }
    };
    
    if (name !== "") {
      countWhere.identityName = {
        [Op.like]: `%${name}%`
      };
    }
    if(status!=="") {
      countWhere.designationStatus = status;
    }

    let query = `SELECT identityID, identityName, identityStatus FROM empidentity WHERE ${where} ORDER BY identityID DESC LIMIT ${
      page - 1
    }, ${limit} `;

    const listData = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (listData.length > 0) {
      let totalRecords = await empidentity.count(countWhere);
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
      identityName,
      identityStatus
    } = req.body;
    try {
      const newUser = await empidentity.create({
        identityName,
        identityStatus,
        identityCreatedBy:employeeID,
        identityCreatedOn:new Date()
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
    let where = `identityID='${ID}'`;
    let query = `SELECT * FROM empidentity WHERE ${where}`;

    console.log(query, 'queryqueryquery')
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
    const getDetail = await empidentity.findOne({ where: { identityID: ID } });
    if(getDetail!==null) {
      const updateData = {
        identityName:request?.identityName ?? '',
        identityStatus:request?.identityStatus ?? '',
        identityUpdatedBy:employeeID,
        identityUpdatedOn:new Date()
      }

      await empidentity.update(updateData, {
        where: { identityID: ID },
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
    const getDetail = await empidentity.findOne({ where: { identityID: ID } });
    if(getDetail!==null) {
      const deleteDetails = await empidentity.destroy({ where: { identityID: ID } });
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
    let query = `SELECT identityID AS value, identityName AS label FROM empidentity WHERE identityStatus='A' `;
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
