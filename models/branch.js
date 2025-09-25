// models/branch.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const branch = sequelize.define('branch', {
    branchID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    branchName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    branchAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    branchGSTNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    branchContactPerson: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    branchContactPhone: {
        type: DataTypes.STRING,
        allowNull: false,
    },    
    branchStatus: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    branchCreatedOn: {
        type: DataTypes.DATE,
        allowNull: false,  
    },
    branchCreatedBY: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    branchUpdatedOn: {
        type: DataTypes.DATE,
        allowNull: false,  
    },
    branchUpdatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
},{timestamps:false,    tableName: 'branch',
});

module.exports = branch;
