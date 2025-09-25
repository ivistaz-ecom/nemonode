// models/povendor.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const povendor = sequelize.define('povendor', {
    vendorID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    vendorName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    vendorAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    vendorGSTNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    vendorPhone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    vendorEmail: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    vendorStatus: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    vendorCreatedOn: {
        type: DataTypes.DATE,
        allowNull: false,  
    },
    vendorCreatedBY: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    vendorUpdatedOn: {
        type: DataTypes.DATE,
        allowNull: false,  
    },
    vendorUpdatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
},{timestamps:false,    tableName: 'povendor',
});

module.exports = povendor;
