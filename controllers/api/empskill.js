const empskillmaster = require("../../models/empskillmaster");
const bcrypt = require("bcrypt");
const sequelize = require("../../util/database");
const { Op } = require("sequelize");
const { base64decode } = require("nodejs-base64");
const moduleName = 'Skill'

const list = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const name = req.query?.name ?? '';
    const status = req.query?.status ?? '';

    

    let where = `empskillID IS NOT NULL`;
    if(name!=="") {
      where+=` AND empskillName LIKE '%${name}%'`;
    }
    if(status!=="") {
      where+=` AND empskillStatus='${status}'`;
    }
    let countWhere = {
      empskillID: { [Op.ne]: null }
    };
    
    if (name !== "") {
      countWhere.empskillName = {
        [Op.like]: `%${name}%`
      };
    }
    if(status!=="") {
      countWhere.designationStatus = status;
    }

    let query = `SELECT empskillID, empskillName, empskillStatus FROM empskillmaster WHERE ${where} ORDER BY empskillID DESC LIMIT ${
      page - 1
    }, ${limit} `;

    const listData = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (listData.length > 0) {
      let totalRecords = await empskillmaster.count(countWhere);
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
      empskillName,
      empskillStatus
    } = req.body;
    try {
      const newUser = await empskillmaster.create({
        empskillName,
        empskillStatus,
        empskillCreatedBy:employeeID,
        empskillCreatedOn:new Date()
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
    let where = `empskillID='${ID}'`;
    let query = `SELECT * FROM empskillmaster WHERE ${where}`;
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
    const getDetail = await empskillmaster.findOne({ where: { empskillID: ID } });
    if(getDetail!==null) {
      const updateData = {
        empskillName:request?.empskillName ?? '',
        empskillStatus:request?.empskillStatus ?? '',
        empskillUpdatedBy:employeeID,
        empskillUpdatedOn:new Date()
      }

      await empskillmaster.update(updateData, {
        where: { empskillID : ID },
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
    const getDetail = await empskillmaster.findOne({ where: { empskillID : ID } });
    if(getDetail!==null) {
      const deleteDetails = await empskillmaster.destroy({ where: { empskillID : ID } });
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
    let query = `SELECT empskillID  AS value, empskillName AS label FROM empskillmaster WHERE empskillStatus='A' `;
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
