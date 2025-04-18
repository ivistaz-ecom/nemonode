const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Discussion = sequelize.define('discussion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    companyname: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    
    join_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    discussion: {
        type: DataTypes.TEXT,
    },
    reason: {
        type: DataTypes.TEXT,   
    },
    post_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    reminder: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    r_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    discussionranks: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    discussionconnected: {
        type: DataTypes.STRING,
        allowNull: true,
    }
    
}, {
    tableName: 'discussion',
    timestamps: false,
});

module.exports = Discussion;
