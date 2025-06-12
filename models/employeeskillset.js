// models/employeeskillset.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const employeeskillset = sequelize.define('employeeskillset', {
    empskillsetID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    empID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    empskillID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    empskillsetType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    empskillsetLevel: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    empskillsetWEF: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    empskillsetcreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    empskillsetcreatedOn: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    empskillsetupdatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,  
    },
    empskillsetupdatedOn: {
        type: DataTypes.DATE,
        allowNull: true,
    },
},{timestamps:false,    tableName: 'employeeskillset',
});

module.exports = employeeskillset;
