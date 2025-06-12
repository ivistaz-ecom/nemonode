// models/empidentity.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const empidentity = sequelize.define('empidentity', {
    identityID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    identityName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    identityStatus: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    identityCreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    identityCreatedOn: {
        type: DataTypes.DATE,
        allowNull: false,  
    },
    identityUpdatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    identityUpdatedOn: {
        type: DataTypes.DATE,
        allowNull: true, 
    }
},{timestamps:false,    tableName: 'empidentity',
});

module.exports = empidentity;
