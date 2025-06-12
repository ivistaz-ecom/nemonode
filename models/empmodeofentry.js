// models/empmodeofentry.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const empmodeofentry = sequelize.define('empmodeofentry', {
    modeID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    modeName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    modeStatus: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    modeCreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    modeCreatedOn: {
        type: DataTypes.DATE,
        allowNull: false,  
    },
    modeUpdatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    modeUpdatedOn: {
        type: DataTypes.DATE,
        allowNull: true, 
    }
},{timestamps:false,    tableName: 'empmodeofentry',
});

module.exports = empmodeofentry;
