// models/employeeidentity.js
const { DataTypes } = require('sequelize');
const sequelize = require("../util/database");

const employeeidentity = sequelize.define(
  "employeeidentity",
  {
    empidentityID : {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    empID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    identityID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    IdentityNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    IdentityName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    identityissueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    identityexpiryDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    IdentityAttach: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    IdentityVerified: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdOn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updatedOn: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { timestamps: false, tableName: "employeeidentity" }
);

module.exports = employeeidentity;
