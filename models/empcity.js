// models/empcity.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const empcity = sequelize.define('empcity', {
    cityID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    cityName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cityStatus: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cityCreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cityCreatedOn: {
        type: DataTypes.DATE,
        allowNull: false,  
    },
    cityUpdatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    cityUpdatedOn: {
        type: DataTypes.DATE,
        allowNull: true, 
    }
},{timestamps:false,    tableName: 'empcity',
});

module.exports = empcity;
