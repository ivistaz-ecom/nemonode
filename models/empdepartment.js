// models/employee.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const employee = sequelize.define('empdepartment', {
    departmentID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    departmentName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    departmentStatus: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    departmentCreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    departmentCreatedOn: {
        type: DataTypes.DATE,
        allowNull: false,  
    },
    departmentUpdatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    departmentUpdatedOn: {
        type: DataTypes.DATE,
        allowNull: true, 
    }
},{timestamps:false,    tableName: 'empdepartment',
});

module.exports = employee;
