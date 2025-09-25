// models/purchaseorderitem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const purchaseorderitem = sequelize.define('purchaseorderitem', {
    poItemID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    poID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    poItemCateogryID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    poItemCandidateID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    poItemQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    poItemUnit: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    poItemRate: {
        type: DataTypes.DECIMAL(11, 2),
        allowNull: true,
    },
    poItemTotalRate: {
        type: DataTypes.DECIMAL(11, 2),
        allowNull: true,
    }
},{timestamps:false,    tableName: 'purchaseorderitem',
});

module.exports = purchaseorderitem;
