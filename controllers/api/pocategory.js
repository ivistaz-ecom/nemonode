const pocategory = require("../../models/pocategory");
const bcrypt = require("bcrypt");
const sequelize = require("../../util/database");
const { Op } = require("sequelize");
const { base64decode } = require("nodejs-base64");
const moduleName = "Category";

const list = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const name = req.query?.name ?? "";
    const status = req.query?.status ?? "";

    let where = `categoryID IS NOT NULL`;
    if (name !== "") {
      where += ` AND categoryName LIKE '%${name}%'`;
    }
    if (status !== "") {
      where += ` AND categoryStatus='${status}'`;
    }
    let countWhere = {
      categoryID: { [Op.ne]: null },
    };

    if (name !== "") {
      countWhere.categoryName = {
        [Op.like]: `%${name}%`,
      };
    }
    if (status !== "") {
      countWhere.categoryStatus = status;
    }

    let query = `SELECT categoryID, categoryName, categoryStatus FROM pocategory WHERE ${where} ORDER BY categoryID DESC LIMIT ${page - 1}, ${limit} `;
    const listData = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });
    console.log(listData, 'listDatalistData')
    if (listData.length > 0) {
      let totalRecords = await pocategory.count(countWhere);
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
    const { categoryName, categoryStatus } = req.body;
    try {
      const newUser = await pocategory.create({
        categoryName,
        categoryStatus,
        categoryCreatedBY: userId,
        categoryCreatedOn: new Date(),
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
    let where = `categoryID='${ID}'`;
    let query = `SELECT a.* FROM pocategory  WHERE ${where}`;
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
    const { categoryName, categoryStatus } = req.body;
    const getDetail = await pocategory.findOne({ where: { categoryID: ID } });
    if (getDetail !== null) {
      const updateData = {
        categoryName,
        categoryStatus,
        categoryUpdatedBy: userId,
        categoryUpdatedOn: new Date(),
      };

      await pocategory.update(updateData, {
        where: { categoryID: ID },
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
    const getDetail = await pocategory.findOne({ where: { categoryID: ID } });
    if (getDetail !== null) {
      const deleteDetails = await pocategory.destroy({ where: { categoryID: ID } });
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
    let query = `SELECT categoryID AS value, categoryName AS label FROM pocategory WHERE categoryStatus='A'`;
    console.log(query, 'queryqueryqueryquery')
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
