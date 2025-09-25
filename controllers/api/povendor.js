const povendor = require("../../models/povendor");
const bcrypt = require("bcrypt");
const sequelize = require("../../util/database");
const { Op } = require("sequelize");
const { base64decode } = require("nodejs-base64");
const moduleName = "Vendor";

const list = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const name = req.query?.name ?? "";
    const status = req.query?.status ?? "";

    let where = `vendorID IS NOT NULL`;
    if (name !== "") {
      where += ` AND vendorName LIKE '%${name}%'`;
    }
    if (status !== "") {
      where += ` AND vendorStatus='${status}'`;
    }
    let countWhere = {
      vendorID: { [Op.ne]: null },
    };

    if (name !== "") {
      countWhere.vendorName = {
        [Op.like]: `%${name}%`,
      };
    }
    if (status !== "") {
      countWhere.vendorStatus = status;
    }

    let query = `SELECT vendorID, vendorName, vendorAddress, vendorGSTNumber, vendorPhone, vendorEmail, vendorStatus FROM povendor WHERE ${where} ORDER BY vendorID DESC LIMIT ${page - 1}, ${limit} `;
    const listData = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });
    console.log(listData, 'listDatalistData')
    if (listData.length > 0) {
      let totalRecords = await povendor.count(countWhere);
      const totalPage = Math.ceil(totalRecords / limit);
      return res.status(200).json({
        success: true,
        result: listData,
        totalRecords: totalRecords,
        totalPage: totalPage,
      });
    } else {
      res.status(400).json({ success: false, message: `No ${moduleName} found.` });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(400).json({ success: false, message: `Internal Server Error ${err}` });
  }
};

const save = async (req, res) => {
  try {
    const userId = req.user.id;
    const { vendorName, vendorAddress, vendorGSTNumber, vendorPhone, vendorStatus } = req.body;
    try {
      const newUser = await povendor.create({
        vendorName,
        vendorAddress,
        vendorGSTNumber,
        vendorPhone,
        vendorEmail,
        vendorStatus,
        vendorCreatedBY: userId,
        vendorCreatedOn: new Date(),
      });
      if (newUser !== "") {
        res.status(200).json({ success: true, message: `The ${moduleName} has been created successfully.` });
      } else {
        res.status(400).json({ success: false, message: `Unable to create ${moduleName}. Please try again.` });
      }
    } catch (err) {
      console.error("Error creating user:", err);
      res.status(400).json({ success: false, message: `Unable to create ${moduleName}. Please try again.` });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(400).json({ success: false, message: `Internal Server Error ${err}` });
  }
};

const getDetails = async (req, res) => {
  try {
    const ID = base64decode(req.params.ID);
    let where = `vendorID='${ID}'`;
    let query = `SELECT a.* FROM povendor  WHERE ${where}`;
    const Details = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (Details.length > 0) {
      return res.status(200).json({
        success: true,
        result: Details[0],
      });
    } else {
      res.status(400).json({ success: false, message: `Invalid ${moduleName}` });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(400).json({ success: false, message: `Internal Server Error ${err}` });
  }
};

const update = async (req, res) => {
  try {
    const userId = req.user.id;
    const ID = base64decode(req.params.ID);
    const request = req.body;
    const { vendorName, vendorAddress, vendorGSTNumber, vendorPhone, vendorStatus } = req.body;
    const getDetail = await branch.findOne({ where: { branchID: ID } });
    if (getDetail !== null) {
      const updateData = {
        vendorName,
        vendorAddress,
        vendorGSTNumber,
        vendorPhone,
        vendorEmail,
        vendorStatus,
        vendorUpdatedBy: userId,
        vendorUpdatedOn: new Date(),
      };

      await povendor.update(updateData, {
        where: { vendorID: ID },
      });
      res.status(200).json({ success: true, message: `${moduleName} updated successfully.` });
    } else {
      res.status(400).json({ success: false, message: `Invalid ${moduleName}` });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(400).json({ success: false, message: `Internal Server Error ${err}` });
  }
};

const deleteData = async (req, res) => {
  try {
    const ID = base64decode(req.params.ID);
    const getDetail = await povendor.findOne({ where: { vendorID: ID } });
    if (getDetail !== null) {
      const deleteDetails = await povendor.destroy({ where: { vendorID: ID } });
      if (deleteDetails !== null) {
        res.status(200).json({ success: true, message: `${moduleName} deleted successfully.` });
      } else {
        res.status(400).json({ success: false, message: `Failed to delete ${moduleName}` });
      }
    } else {
      res.status(400).json({ success: false, message: `Invalid ${moduleName}` });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(400).json({ success: false, message: `Internal Server Error ${err}` });
  }
};

const dropdownlist = async (req, res) => {
  try {
    let query = `SELECT vendorID AS value, vendorName AS label FROM povendor WHERE vendorStatus='A'`;
    const listData = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });
    if (listData.length > 0) {
      return res.status(200).json({
        success: true,
        result: listData,
      });
    } else {
      res.status(400).json({ success: false, message: `No ${moduleName} found.` });
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(400).json({ success: false, message: `Internal Server Error ${err}` });
  }
};

module.exports = { save, list, getDetails, update, deleteData, dropdownlist};
