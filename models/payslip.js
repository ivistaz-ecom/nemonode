const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Payslip = sequelize.define('Payslip', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    candidateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    contractId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    month: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    daysWorked: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // New fields
    openingBalance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    basicWages: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    leaveWages: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    overtimeWages: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    leaveSubsistence: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    consolidateAllowance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    fixedOvertime: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    subsistenceAllowance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    uniformAllowance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    miscAllowance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    otherAllowance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    onboardOtWages: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    joiningBasic: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    tankCleaningBonus: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    additionalWorks: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    prevMonthBalance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    reimbursement: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    radio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    onboardFinalSettlement: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    otherDeductions: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    training: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    bondStore: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    cdc_passport:{
        type:DataTypes.STRING,
        allowNull:true
    },
    sign_on:{
type:DataTypes.STRING,
allowNull:true
    },
    currency:{
        type:DataTypes.STRING,
        allowNull:true
    },
    rank:{
        type:DataTypes.STRING,
        allowNull:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:true
    },
    vesselName:{
        type:DataTypes.STRING,
        allowNull:true
    }
}, {
    tableName: 'payslip',
    timestamps: false,
});

module.exports = Payslip;
