// models/employeepersonalinfo.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const employeepersonalinfo = sequelize.define('employeepersonalinfo', {
    infoID : {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    empID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fatherName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    MotherName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    maritalStatus: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    marriageDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    personalEmailId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    nomineeEmail: {
        type: DataTypes.STRING,
        allowNull: true,
    }, 
    religion: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    nationality: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    countryOfBirth: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    stateOfBirth: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    placeOfBirth: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    physicalDisabilities: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    disabilityRemark: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    identificationMark1: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    identificationMark2: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    extraCurricularInterest: {
        type: DataTypes.STRING,
        allowNull: true,
    }
},{timestamps:false,    tableName: 'employeepersonalinfo',
});

module.exports = employeepersonalinfo;
