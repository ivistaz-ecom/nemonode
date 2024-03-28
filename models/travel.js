// File: Port.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Travel = sequelize.define('Travel', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    travel_date: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      travel_from: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      travel_to: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      travel_mode: {
        type: DataTypes.STRING,
        allowNull: true,
        // validate: {
        //   isIn: [['BUS', 'TRAIN', 'AIR', 'CAB']],
        // },
      },
      travel_status: {
        type: DataTypes.STRING,
        allowNull: true,
        // validate: {
        //   isIn: [['BOOKED', 'CANCELLED', 'TRAVELLING', 'TRAVELLED']],
        // },
      },
      ticket_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      agent_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      portAgent: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      
      travel_amount: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      reason:{
        type:DataTypes.STRING,
      },
      created_by:{
        type:DataTypes.STRING
      }
}, {
    tableName: 'travel',
    timestamps: false,
});

module.exports = Travel;
