const { DataTypes } = require('sequelize');
const  sequelize  = require('../util/database'); 

const Medical = sequelize.define('Medical', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    hospitalName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    place: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  expiry_date: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  done_by: {
    type: DataTypes.STRING,
    allowNull: true,
    // validate: {
    //   isIn: [['OFFICE', 'AGENT', 'SELF']],
    // },
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    // validate: {
    //   isIn: [['FIT', 'UNFIT']],
    // },
  },
  amount: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  upload: {
    type: DataTypes.STRING, // Assuming a string to store the file path or URL
    allowNull: true,
  },
  created_by:{
    type:DataTypes.STRING
  },
  
},{timestamps:false});

module.exports = Medical;
