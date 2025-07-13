// models/employee.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const employee = sequelize.define('employee', {
    employeeID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    empCompanyID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    empBranchID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },    
    empUserName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    empPassword: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    empTitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    empFirstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    empLastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    empShortName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    empCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    empPhoto: {
        type: DataTypes.STRING,
        allowNull: false,
    },    
    empDesignation: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    empDepartment: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    empCity: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    empAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },    
    empBloodGroup: {
        type: DataTypes.STRING,
        allowNull: true,
    },    
    empDOB: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    empDOJ: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    empReportingBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    empApprovedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    empContractType: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    empEmail: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    empMobile: {
        type: DataTypes.STRING,
        allowNull: false,
    },    
    empGender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    empConfirmationDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    empDateOfLeaving: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    empLastWorkingDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    empPayStructureAppliedFromDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    empStatus: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    empPTApplicable: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    empPTDate: {
        type: DataTypes.DATE,
        allowNull: false,  
    },    
    empCreatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    empCreatedOn: {
        type: DataTypes.DATE,
        allowNull: false,  
    },
    empUpdatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    empUpdatedOn: {
        type: DataTypes.DATE,
        allowNull: true, 
    }
},{timestamps:false,    tableName: 'employee',
});

module.exports = employee;
