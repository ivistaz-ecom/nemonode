// File: Vsl.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Vsl = sequelize.define('Vsl', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    vesselName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    vesselType: {
        type: DataTypes.STRING,
    },
    vsl_company: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imoNumber: {
        type: DataTypes.STRING,
    },
    vesselFlag: {
        type: DataTypes.STRING,
    },
    vessel_max_price:{
        type:DataTypes.STRING
    },
    vesselGRT:{
        type:DataTypes.STRING
    },
    vesselEngine:{
        type:DataTypes.STRING
    },
    vesselKWT:{
        type:DataTypes.STRING
    },
    vesselCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'vsls',
    timestamps: false,
});

module.exports = Vsl;
