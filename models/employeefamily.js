// models/employeefamily.js
const { DataTypes } = require('sequelize');
const sequelize = require("../util/database");

const employeefamily = sequelize.define(
  "employeefamily",
  {
    familyID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    familyEmpID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    familyIsDependent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    familyTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    familyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    familyGender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    familyRelation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    familyAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    familyBloodGroup: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    familyContactNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    familyDOB: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    familyMaritalStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    familyMarriageDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    familyEmployment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    familyProfession: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    familyNationality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    familyInsuranceNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    familyRemarks: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    familyAttachment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    familycreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    familycreatedOn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    familyupdatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    familyupdatedOn: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { timestamps: false, tableName: "employeefamily" }
);

module.exports = employeefamily;
