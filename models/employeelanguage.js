// models/employeelanguage.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const employeelanguage = sequelize.define('employeelanguage', {
    emplanguageID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    empID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    languageID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    emplanguageMotherTongue: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    emplanguageSpeak: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    emplanguageRead: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    emplanguageWrite: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    emplanguagecreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    emplanguagecreatedOn: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    emplanguageupdatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,  
    },
    emplanguageupdatedOn: {
        type: DataTypes.DATE,
        allowNull: true,
    },
},{timestamps:false,    tableName: 'employeelanguage',
});

module.exports = employeelanguage;
