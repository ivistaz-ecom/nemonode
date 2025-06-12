const employeeskillset = require("../../models/employeeskillset");
const sequelize = require("../../util/database");
const { Op } = require("sequelize");
const { base64decode } = require("nodejs-base64");
const moduleName = 'Skill Set'

const list = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const name = req.query?.name ?? '';
    let employeeID = req.query?.employeeID ?? '';  
    employeeID = base64decode(employeeID);  

    let where = `empskillsetID IS NOT NULL AND empID='${employeeID}'`;
    if(name!=="") {
      where+=` AND familyName LIKE '%${name}%'`;
    }
    let countWhere = {
      empskillsetID: { [Op.ne]: null }
    };

    let query = `SELECT a.*, b.empskillName FROM employeeskillset AS a LEFT JOIN empskillmaster AS b ON a.empskillID=b.empskillID  WHERE ${where} ORDER BY empskillsetID DESC LIMIT ${
      page - 1
    }, ${limit} `;
   
    const listData = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (listData.length > 0) {
      let totalRecords = await employeeskillset.count(countWhere);
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
      const newUser = await employeeskillset.create({
        empID:empID,
        empskillID:request?.empskillID ?? '',
        empskillsetType:request?.empskillsetType,
        empskillsetLevel:request?.empskillsetLevel,
        empskillsetWEF:request?.empskillsetWEF ?? '', 
        empskillsetcreatedBy:employeeID,
        empskillsetcreatedOn:new Date()
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
    let where = `a.empskillsetID='${ID}'`;
    let query = `SELECT a.*, b.empskillName FROM employeeskillset AS a LEFT JOIN empskillmaster AS b ON a.empskillID=b.empskillID   WHERE ${where}`;
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
    const getDetail = await employeeskillset.findOne({ where: { empskillsetID: ID } });
    if(getDetail!==null) {
      const updateData = {
        empskillID:request?.empskillID ?? '',
        empskillsetType:request?.empskillsetType,
        empskillsetLevel:request?.empskillsetLevel,
        empskillsetWEF:request?.empskillsetWEF ?? '',
        empskillsetupdatedBy:employeeID,
        empskillsetupdatedOn:new Date()
      }

      await employeeskillset.update(updateData, {
        where: { empskillsetID : ID },
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
    const getDetail = await employeeskillset.findOne({ where: { empskillsetID : ID } });
    if(getDetail!==null) {
      const deleteDetails = await employeeskillset.destroy({ where: { empskillsetID : ID } });
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
