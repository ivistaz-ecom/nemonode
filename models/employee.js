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
    empMiddleName: {
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
    empGratuityStartDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    empWEF: {
        type: DataTypes.DATE,
        allowNull: true,
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
    empTransferDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    empExpectedConfirmationDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    empProbationPeriod: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
    empRetirementDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    empPayStructureAppliedFromDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    empNoticePeriodForEmployer: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    empNoticePeriodforEmployee: {
        type: DataTypes.STRING,
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
