const emplanguagemaster = require("../../models/emplanguagemaster");
const bcrypt = require("bcrypt");
const sequelize = require("../../util/database");
const { Op } = require("sequelize");
const { base64decode } = require("nodejs-base64");
const moduleName = 'Language'

const list = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const name = req.query?.name ?? '';
    const status = req.query?.status ?? '';

    

    let where = `languageID IS NOT NULL`;
    if(name!=="") {
      where+=` AND languageName LIKE '%${name}%'`;
    }
    if(status!=="") {
      where+=` AND languageStatus='${status}'`;
    }
    let countWhere = {
      languageID : { [Op.ne]: null }
    };
    
    if (name !== "") {
      countWhere.languageName = {
        [Op.like]: `%${name}%`
      };
    }
    if(status!=="") {
      countWhere.designationStatus = status;
    }

    let query = `SELECT languageID , languageName, languageStatus FROM emplanguagemaster WHERE ${where} ORDER BY languageID  DESC LIMIT ${
      page - 1
    }, ${limit} `;

    const listData = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (listData.length > 0) {
      let totalRecords = await emplanguagemaster.count(countWhere);
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
      languageName,
      languageStatus
    } = req.body;
    try {
      const newUser = await emplanguagemaster.create({
        languageName,
        languageStatus,
        languageCreatedBy:employeeID,
        languageCreatedOn:new Date()
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
    let where = `languageID ='${ID}'`;
    let query = `SELECT * FROM emplanguagemaster WHERE ${where}`;
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
    const getDetail = await emplanguagemaster.findOne({ where: { languageID : ID } });
    if(getDetail!==null) {
      const updateData = {
        languageName:request?.languageName ?? '',
        languageStatus:request?.languageStatus ?? '',
        languageUpdatedBy:employeeID,
        languageUpdatedOn:new Date()
      }

      await emplanguagemaster.update(updateData, {
        where: { languageID : ID },
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
    const getDetail = await emplanguagemaster.findOne({ where: { languageID : ID } });
    if(getDetail!==null) {
      const deleteDetails = await emplanguagemaster.destroy({ where: { languageID : ID } });
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
    let query = `SELECT languageID  AS value, languageName AS label FROM emplanguagemaster WHERE languageStatus='A' `;
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
