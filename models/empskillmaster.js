// models/empskillmaster.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const empskillmaster = sequelize.define('empskillmaster', {
    empskillID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    empskillName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    empskillStatus: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    empskillCreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    empskillCreatedOn: {
        type: DataTypes.DATE,
        allowNull: false,  
    },
    empskillUpdatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    empskillUpdatedOn: {
        type: DataTypes.DATE,
        allowNull: true, 
    }
},{timestamps:false,    tableName: 'empskillmaster',
});

module.exports = empskillmaster;
