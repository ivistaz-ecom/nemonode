// models/employeesalary.js
const { DataTypes } = require('sequelize');
const sequelize = require("../util/database");

const employeesalary = sequelize.define(
  "employeesalary",
  {
    salaryID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    empID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    salaryBasic: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: true,
    },
    salaryDA: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: true,
    },
    salaryHRA: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: true,
    },
    salaryConveyance: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: true,
    },
    salaryMedicalAllowance: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: true,
    },
    salaryOtherAllowance: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: true,
    },
    salaryPF: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: true,
    },
    salaryESI: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: true,
    },
    salaryProfessionalTax: {
      type: DataTypes.DECIMAL(11, 2),
      allowNull: true,
    }
  },
  { timestamps: false, tableName: "employeesalary" }
);

module.exports = employeesalary;
