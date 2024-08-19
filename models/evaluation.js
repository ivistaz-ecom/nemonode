// File: Grade.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Evalutaion = sequelize.define('Evalutaion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    eval_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    applied_rank: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    applied_date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    applied_by: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    remote: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    interviewer_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    values: {
        type: DataTypes.JSON, // Use JSON type for MySQL 5.7.8+ or TEXT for older versions
        allowNull: false,
    }

    
}, {
    tableName: 'evaluation',
    timestamps: false,
});

module.exports = Evalutaion;
