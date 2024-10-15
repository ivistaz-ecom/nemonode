// File: Grade.js
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const prevExp = sequelize.define('prevExp', {
    experienceID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    candidateId:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    expFrom:{
        type: Sequelize.DATE,
        allowNull: true,
    },
    expTo:{
        type: Sequelize.DATE,
        allowNull: true,
    },
    vesselName:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    Flag:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    dwt:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    kwt:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    engine:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    typeofvessel:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    position:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    remarks:{
        type: Sequelize.TEXT,
        allowNull: true,
    }
}, {
    tableName: 'prevexperience',
    timestamps: false,
});

module.exports = prevExp;
