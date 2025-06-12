const employeedocument = require("../../models/employeedocument");
const sequelize = require("../../util/database");
const { Op } = require("sequelize");
const { base64decode } = require("nodejs-base64");
const moduleName = 'Document Type'

const list = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const name = req.query?.name ?? '';
    const status = req.query?.status ?? '';   

    let where = `docID IS NOT NULL`;
    if(name!=="") {
      where+=` AND docNumber LIKE '%${name}%'`;
    }
    if(status!=="") {
      where+=` AND docIssuePlace='${status}'`;
    }
    let countWhere = {
      docID: { [Op.ne]: null }
    };
    
    if (name !== "") {
      countWhere.docNumber = {
        [Op.like]: `%${name}%`
      };
    }
    if(status!=="") {
      countWhere.designationStatus = status;
    }

    let query = `SELECT a.docID, a.docNumber, a.docIssuePlace, a.docTypeID, a.docIssueDate, a.docExpiryDate, a.docFile, b.empdoctypeName FROM employeedocument  AS a LEFT JOIN empdoctype AS b ON a.docTypeID=b.empdoctypeID WHERE ${where} ORDER BY docID DESC LIMIT ${
      page - 1
    }, ${limit} `;

    const listData = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (listData.length > 0) {
      let totalRecords = await employeedocument.count(countWhere);
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
    try {
      const empID = base64decode(request.empID);
      const newUser = await employeedocument.create({
        empID,
        docTypeID:request?.docTypeID?? '',
        docNumber:request?.docNumber?? '',
        docIssuePlace:request?.docIssuePlace?? '',
        docIssueDate:request?.docIssueDate?? null,
        docExpiryDate:request?.docExpiryDate?? null,
        docFile:request?.docFile?? '',
        docCreatedBy:employeeID,
        docCreatedOn:new Date()
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
    let where = `docID='${ID}'`;
    let query = `SELECT * FROM employeedocument WHERE  ${where}`;
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
    const getDetail = await employeedocument.findOne({ where: { docID: ID } });
    if(getDetail!==null) {
      const updateData = {
        docTypeID:request?.docTypeID?? '',
        docNumber:request?.docNumber?? '',
        docIssuePlace:request?.docIssuePlace?? '',
        docIssueDate:request?.docIssueDate?? null,
        docExpiryDate:request?.docExpiryDate?? null,
        docFile:request?.docFile?? '',
        docUpdatedBy:employeeID,
        docUpdatedOn:new Date()
      }

      await employeedocument.update(updateData, {
        where: { docID: ID },
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
    const getDetail = await employeedocument.findOne({ where: { docID: ID } });
    if(getDetail!==null) {
      const deleteDetails = await employeedocument.destroy({ where: { docID: ID } });
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
