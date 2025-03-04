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
    sign_on_dg :{
        type:DataTypes.DATE,
        allowNull:true
    },
    wage_start :{
        type:DataTypes.DATE,
        allowNull:true
    },
       eoc :{
        type:DataTypes.DATE,
        allowNull:true
    },
    wages :{
        type:DataTypes.STRING
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: true,
        
      },
      wages_types: {
        type: DataTypes.STRING,
        allowNull: true,
    
    },
    sign_off_port :{
        type:DataTypes.STRING
    },
    sign_off :{
        type:DataTypes.DATE,
        allowNull:true
    },
    sign_off_dg :{
        type:DataTypes.DATE,
        allowNull:true
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

    openingBalance:{
        type:DataTypes.INTEGER
    },
    basicWages:{
        type:DataTypes.INTEGER
    },
    leaveWages:{
        type:DataTypes.INTEGER
    },
    overtimeWages:{
        type:DataTypes.INTEGER
    },
    leaveSubsistence:{
        type:DataTypes.INTEGER
    },
    consolidateAllowance:{
        type:DataTypes.INTEGER
    },
    fixedOvertime:{
        type:DataTypes.INTEGER
    },
    subsistenceAllowance:{
        type:DataTypes.INTEGER
    },
    uniformAllowance:{
        type:DataTypes.INTEGER
    },
    miscAllowance:{
        type:DataTypes.INTEGER
    },
    otherAllowance:{
        type:DataTypes.INTEGER
    },
    onboardOtWages:{
        type:DataTypes.INTEGER
    },
    joiningBasic:{
        type:DataTypes.INTEGER
    },
    tankCleaningBonus:{
        type:DataTypes.INTEGER
    },
    additionalWorks:{
        type:DataTypes.INTEGER
    },
    prevMonthBalance:{
        type:DataTypes.INTEGER
    },
    reimbursement:{
        type:DataTypes.INTEGER
    },
    radio:{
        type:DataTypes.INTEGER
    },
    onboardFinalSettlement:{
        type:DataTypes.INTEGER
    },
    otherDeductions:{
        type:DataTypes.INTEGER
    },
    training:{
        type:DataTypes.INTEGER
    },
    bondStore:{
        type:DataTypes.INTEGER
    },
    cdc_passport:{
        type:DataTypes.STRING
    }
    
    // candidate = models.ForeignKey(Candidate,models.CASCADE,null=True)
}, {
    tableName: 'contract',
    timestamps: false,
});

module.exports = Contract;
