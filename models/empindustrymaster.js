// models/empindustrymaster.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const empindustrymaster = sequelize.define('empindustrymaster', {
    industryID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    industryName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    industryStatus: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    industryCreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    industryCreatedOn: {
        type: DataTypes.DATE,
        allowNull: false,  
    },
    industryUpdatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    industryUpdatedOn: {
        type: DataTypes.DATE,
        allowNull: true, 
    }
},{timestamps:false,    tableName: 'empindustrymaster',
});

module.exports = empindustrymaster;
