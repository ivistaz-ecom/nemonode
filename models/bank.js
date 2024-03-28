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



// ,nri_bank_name :{
//     type:DataTypes.STRING
// },
// nri_account_num :{
//     type:DataTypes.INTEGER
// },
// nri_bank_addr :{
//     type:DataTypes.STRING
// },
// nri_ifsc_code :{
//     type:DataTypes.STRING
// },
// nri_swift_code :{
//     type:DataTypes.STRING
// },
// nri_beneficiary:{
//         type:DataTypes.STRING
// },
// nri_beneficiary_addr:{
//     type:DataTypes.STRING
// },
// nri_passbook:{
//     type:DataTypes.STRING
// },
}, {
    tableName: 'bank',
    timestamps: false,
});

module.exports = Bank;

