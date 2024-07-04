// File: Grade.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Bank = sequelize.define('Bank', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    bank_name :{
        type:DataTypes.STRING
    },
    account_num :{
        type:DataTypes.INTEGER
    },
    bank_addr :{
        type:DataTypes.STRING
    },
    ifsc_code :{
        type:DataTypes.STRING
    },
    swift_code :{
        type:DataTypes.STRING
    },
    beneficiary:{
            type:DataTypes.STRING
    },
    beneficiary_addr:{
        type:DataTypes.STRING
},
pan_num:{
    type:DataTypes.STRING
},
passbook:{
    type:DataTypes.STRING
},
pan_card:{
    type:DataTypes.STRING
}   
,
branch:{
    type:DataTypes.STRING
},
types:{
    type:DataTypes.STRING
},
created_by:{
    type:DataTypes.STRING
}


}, {
    tableName: 'bank',
    timestamps: false,
});

module.exports = Bank;

