// models/employee.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const emplanguagemaster = sequelize.define('emplanguagemaster', {
    languageID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    languageName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    languageStatus: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    languageCreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    languageCreatedOn: {
        type: DataTypes.DATE,
        allowNull: false,  
    },
    languageUpdatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    languageUpdatedOn: {
        type: DataTypes.DATE,
        allowNull: true, 
    }
},{timestamps:false,    tableName: 'emplanguagemaster',
});

module.exports = emplanguagemaster;
