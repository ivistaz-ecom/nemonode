// models/pocategory.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const pocategory = sequelize.define('pocategory', {
    categoryID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    categoryName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    categoryStatus: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    categoryCreatedOn: {
        type: DataTypes.DATE,
        allowNull: false,  
    },
    categoryCreatedBY: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    categoryUpdatedOn: {
        type: DataTypes.DATE,
        allowNull: false,  
    },
    categoryUpdatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
},{timestamps:false,    tableName: 'pocategory',
});

module.exports = pocategory;
