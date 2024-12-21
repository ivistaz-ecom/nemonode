const { DataTypes } = require('sequelize');
const sequelize = require('../util/database'); // Assuming the database connection util is in a separate file

const SeaService = sequelize.define('SeaService', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  candidateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  rank: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  vessel: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  DWT: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  KWT: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Flag: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  GRT: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Engine: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  from1: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  to1: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  total_MMDD: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  reason_for_sign_off: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'sea_service',
  timestamps: false, // disable automatic timestamp columns (createdAt, updatedAt)
});

module.exports = SeaService;
