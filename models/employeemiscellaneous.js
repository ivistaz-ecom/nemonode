// models/employeemiscellaneous.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const employeemiscellaneous = sequelize.define('employeemiscellaneous', {
    miscellaneousID : {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    miscellaneousempID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Height: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Weight: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    BloodGroup: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ShoeSize: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ShirtSize: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    TShirtSize: {
        type: DataTypes.STRING,
        allowNull: true,
    },    
    countryOfBirth: {
        type: DataTypes.STRING,
        allowNull: true,
    },
},{timestamps:false,    tableName: 'employeemiscellaneous',
});

module.exports = employeemiscellaneous;
