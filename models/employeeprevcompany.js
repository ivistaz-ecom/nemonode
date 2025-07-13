// models/employeeprevcompany.js
const { DataTypes } = require('sequelize');
const sequelize = require("../util/database");

const employeeprevcompany = sequelize.define(
  "employeeprevcompany",
  {
    prevCompID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    empID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    leavingDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    typeOfBusiness: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    JoiningDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reportingToDesignation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    designationJoining: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    designationLeaving: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    leavingReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    responsibilities: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    companyAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    achievements: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    financialYear: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastSalaryDrawn: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    PFOfficeName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    PFNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    PFAmountTransfered: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    incomeAfterExemption: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    US80CBenefitClaimed: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    standardDeductionBenefitClaimed: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    professionalTax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    TDSTaxPaid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    rawTax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    surcharge: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    cess: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    attachment: {
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
  { timestamps: false, tableName: "employeeprevcompany" }
);

module.exports = employeeprevcompany;
