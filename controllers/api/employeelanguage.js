const employeelanguage = require("../../models/employeelanguage");
const sequelize = require("../../util/database");
const { Op } = require("sequelize");
const { base64decode } = require("nodejs-base64");
const moduleName = 'Language'

const list = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const name = req.query?.name ?? '';
    let employeeID = req.query?.employeeID ?? '';  
    employeeID = base64decode(employeeID);  

    let where = `emplanguageID IS NOT NULL AND empID='${employeeID}'`;
    let countWhere = {
      emplanguageID: { [Op.ne]: null }
    };

    let query = `SELECT a.*, b.languageName FROM employeelanguage AS a LEFT JOIN emplanguagemaster AS b ON a.languageID=b.languageID  WHERE ${where} ORDER BY emplanguageID DESC LIMIT ${
      page - 1
    }, ${limit} `;
   
    const listData = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (listData.length > 0) {
      let totalRecords = await employeelanguage.count(countWhere);
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
      const newUser = await employeelanguage.create({
        empID:empID,
        languageID:request?.languageID ?? '',
        emplanguageMotherTongue:request?.emplanguageMotherTongue,
        emplanguageSpeak:request?.emplanguageSpeak,
        emplanguageRead:request?.emplanguageRead ?? '', 
        emplanguageWrite:request?.emplanguageWrite   ?? '',  
        emplanguagecreatedBy:employeeID,
        emplanguagecreatedOn:new Date()
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
    let where = `a.emplanguageID='${ID}'`;
    let query = `SELECT a.*, b.languageName FROM employeelanguage AS a LEFT JOIN emplanguagemaster AS b ON a.languageID=b.languageID   WHERE ${where}`;
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
    const getDetail = await employeelanguage.findOne({ where: { emplanguageID: ID } });
    if(getDetail!==null) {
      const updateData = {
        languageID:request?.languageID ?? '',
        emplanguageMotherTongue:request?.emplanguageMotherTongue,
        emplanguageSpeak:request?.emplanguageSpeak,
        emplanguageRead:request?.emplanguageRead ?? '', 
        emplanguageWrite:request?.emplanguageWrite   ?? '', 
        emplanguageupdatedBy:employeeID,
        emplanguageupdatedOn:new Date()
      }

      await employeelanguage.update(updateData, {
        where: { emplanguageID : ID },
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
    const getDetail = await employeelanguage.findOne({ where: { emplanguageID : ID } });
    if(getDetail!==null) {
      const deleteDetails = await employeelanguage.destroy({ where: { emplanguageID : ID } });
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
