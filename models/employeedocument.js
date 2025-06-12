// models/employeedocument.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const employeedocument = sequelize.define('employeedocument', {
    docID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    empID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    docTypeID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    docNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    docIssuePlace: {
        type: DataTypes.STRING,
        allowNull: false,
    },    
    docIssueDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    docExpiryDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    docFile: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    docCreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    docCreatedOn: {
        type: DataTypes.DATE,
        allowNull: false,  
    },
    docUpdatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    docUpdatedOn: {
        type: DataTypes.DATE,
        allowNull: true, 
    }
},{timestamps:false,    tableName: 'employeedocument',
});

module.exports = employeedocument;
