// models/empdoctype.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const empdoctype = sequelize.define('empdoctype', {
    empdoctypeID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    empdoctypeName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    empdoctypeStatus: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    empdoctypeCreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    empdoctypeCreatedOn: {
        type: DataTypes.DATE,
        allowNull: false,  
    },
    empdoctypeUpdatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    empdoctypeUpdatedOn: {
        type: DataTypes.DATE,
        allowNull: true, 
    }
},{timestamps:false,    tableName: 'empdoctype',
});

module.exports = empdoctype;
