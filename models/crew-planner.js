// File: CrewPlanner.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const CrewPlanner = sequelize.define('CrewPlanner', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rank: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    client: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    vesselType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    vesselName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cocAccepted: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    trading: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    wages: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    doj: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    otherInfo: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_by:{
        type:DataTypes.STRING,
    },
    updated_by:{
        type:DataTypes.STRING,
    },
    created_date:{
        type:DataTypes.DATE
    }
}, {
    tableName: 'crew-planner',
});

module.exports = CrewPlanner;
