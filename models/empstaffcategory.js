// models/empstaffcategory.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const empstaffcategory = sequelize.define('empstaffcategory', {
    staffcategoryID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    staffcategoryName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    staffcategoryStatus: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    staffcategoryCreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    staffcategoryCreatedOn: {
        type: DataTypes.DATE,
        allowNull: false,  
    },
    staffcategoryUpdatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    staffcategoryUpdatedOn: {
        type: DataTypes.DATE,
        allowNull: true, 
    }
},{timestamps:false,    tableName: 'empstaffcategory',
});

module.exports = empstaffcategory;
