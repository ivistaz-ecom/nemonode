const { DataTypes } = require('sequelize');
const sequelize = require('../util/database'); // Assuming the database connection util is in a separate file

const Queries = sequelize.define('Queries', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  categories: {
    type: DataTypes.STRING(100),
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.STRING(50),
  },
  created_by: {
    type: DataTypes.INTEGER,
  },
  created_date: {
    type: DataTypes.DATE,
    // defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    // defaultValue: DataTypes.NOW,
  },
  reply:{
    type:DataTypes.STRING
  },
  query_file:{
    type:DataTypes.STRING
  },
}, {
  tableName: 'queries',
  timestamps: false, // disable automatic timestamp columns (createdAt, updatedAt)
});

module.exports = Queries;
