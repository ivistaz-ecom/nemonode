// models/empbranch.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const empbranch = sequelize.define('empbranch', {
    branchID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    branchCompanyID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    branchName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    branchStatus: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    branchCreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    branchCreatedOn: {
        type: DataTypes.DATE,
        allowNull: false,  
    },
    branchUpdatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    branchUpdatedOn: {
        type: DataTypes.DATE,
        allowNull: true, 
    }
},{timestamps:false,    tableName: 'empbranch',
});

module.exports = empbranch;
