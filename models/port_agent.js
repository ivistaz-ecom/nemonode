// File: PortAgent.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const PortAgent = sequelize.define('PortAgent', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    portAgentName: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    contactPerson: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    other_state:{
        type:DataTypes.STRING,
        allowNull:false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'port_agents',
    timestamps: false,
});

module.exports = PortAgent;
