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
}, {
    tableName: 'payslip',
    timestamps: false,
});

module.exports = Payslip;
