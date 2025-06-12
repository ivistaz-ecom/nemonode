// models/empcompany.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const empcompany = sequelize.define('empcompany', {
    companyID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    companyStatus: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    companyCreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    companyCreatedOn: {
        type: DataTypes.DATE,
        allowNull: false,  
    },
    companyUpdatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    companyUpdatedOn: {
        type: DataTypes.DATE,
        allowNull: true, 
    }
},{timestamps:false,    tableName: 'empcompany',
});

module.exports = empcompany;
