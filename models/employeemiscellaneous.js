// models/employeemiscellaneous.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const employeemiscellaneous = sequelize.define('employeemiscellaneous', {
    miscellaneousID : {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    miscellaneousempID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Height: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Weight: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    BloodGroup: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Caste: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ShoeSize: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    WarmClothSize: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ModeOfEntry: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    Module: {
        type: DataTypes.STRING,
        allowNull: true,
    },    
    InternalProgram: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    SuperAnnuationType: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    countryOfBirth: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    SuperAnnuationId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    MedicalPolicy: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    GLReference: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Currency: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    PlaceOfPosting: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    RainCoatProvided: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    InternationalEmployee: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    EmployeeManager: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ServiceInceptionYear: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    CertificateNo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    AadharNo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    PANNo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    PANValidated: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    WEF: {
        type: DataTypes.DATE,
        allowNull: false,
    }
},{timestamps:false,    tableName: 'employeemiscellaneous',
});

module.exports = employeemiscellaneous;
