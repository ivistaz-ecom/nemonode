// models/purchaseorder.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const purchaseorder = sequelize.define('purchaseorder', {
    poID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    pobranchID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },    
    poNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    poType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    poVessel: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    poVendor: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    poDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    poVesselRef: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    poCurrency: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    posubTotal: {
        type: DataTypes.DECIMAL(11, 2),
        allowNull: false,
    },
    poLessDiscount: {
        type: DataTypes.DECIMAL(11, 2),
        allowNull: true,
    },
    poGSTAmount: {
        type: DataTypes.DECIMAL(11, 2),
        allowNull: true,
    },
    poDelCharges: {
        type: DataTypes.DECIMAL(11, 2),
        allowNull: true,
    },
    poInsuranceAmount: {
        type: DataTypes.DECIMAL(11, 2),
        allowNull: true,
    },
    poOtherAmount: {
        type: DataTypes.DECIMAL(11, 2),
        allowNull: true,
    },
    poGrandTotal: {
        type: DataTypes.DECIMAL(11, 2),
        allowNull: false,
    },
    poNote :{
        type: DataTypes.STRING,
        allowNull: true,
    },
    poInvoice :{
        type: DataTypes.STRING,
        allowNull: true,
    },
    poCreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,  
    },
    poCreateOn: {
        type: DataTypes.DATE,
        allowNull: false,
    }
},{timestamps:false,    tableName: 'purchaseorder',
});

module.exports = purchaseorder;
