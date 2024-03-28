// File: Grade.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Contract = sequelize.define('Contract', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rank:{
        type:DataTypes.STRING
    },
      company:{
        type:DataTypes.STRING
      },
            vslName:{
                type:DataTypes.STRING,
            },
            vesselType:{
                type:DataTypes.STRING
            },
    
    sign_on_port :{
        type:DataTypes.STRING
    },
    sign_on :{
        type:DataTypes.DATE
    },
    wage_start :{
        type:DataTypes.DATE
    },
       eoc :{
        type:DataTypes.DATE
    },
    wages :{
        type:DataTypes.STRING
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: true,
        // validate: {
        //   isIn: [['AED', 'BMD', 'EUR', 'GBP', 'INR', 'MYR', 'SGD', 'USD']],
        // },
      },
      wages_types: {
        type: DataTypes.STRING,
        allowNull: true,
        // validate: {
        //   isIn: [['NETT', 'GROSS', 'PER DAY', 'PER MONTH']],
        // }
    },
    sign_off_port :{
        type:DataTypes.STRING
    },
    sign_off :{
        type:DataTypes.DATE
    },
    reason_for_sign_off:{
        type:DataTypes.STRING
    },
        documents:{
            type:DataTypes.STRING,
        },
    aoa:{
        type:DataTypes.STRING,
    },
     aoa_number :{
        type:DataTypes.STRING,
    },
    emigrate_number :{
        type:DataTypes.STRING,
    },
    created_by:{
        type:DataTypes.STRING,
    },
    // candidate = models.ForeignKey(Candidate,models.CASCADE,null=True)
}, {
    tableName: 'contract',
    timestamps: false,
});

module.exports = Contract;
