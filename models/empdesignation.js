// models/employee.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const employee = sequelize.define('empdesignation', {
    designationID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    designationName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    designationStatus: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    designationCreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    designationCreatedOn: {
        type: DataTypes.DATE,
        allowNull: false,  
    },
    designationUpdatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    designationUpdatedOn: {
        type: DataTypes.DATE,
        allowNull: true, 
    }
},{timestamps:false,    tableName: 'empdesignation',
});

module.exports = employee;
