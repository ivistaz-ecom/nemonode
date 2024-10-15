const { DataTypes } = require('sequelize');
const sequelize = require('../util/database'); // Replace with your Sequelize instance

const CandidateNkd = sequelize.define('CandidateNkd', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    kin_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  kin_relation: {
    type: DataTypes.STRING, 
    allowNull: true,
  },
  kin_contact_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  kin_email: {
      type: DataTypes.STRING,
      allowNull: true,
  },
  kin_contact_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  kin_priority: {
    type: DataTypes.STRING,
    allowNull: true,
  },
},{
  timestamps:false
});

module.exports = CandidateNkd;
