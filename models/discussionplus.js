const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Discussion_plus = sequelize.define('Discussion_plus', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    proposed: {
        type: DataTypes.BOOLEAN,
    },
    approved: {
        type: DataTypes.BOOLEAN,
    },
    joined: {
        type: DataTypes.BOOLEAN,
    },
    rejected: {
        type: DataTypes.BOOLEAN,
    },
    company_name: {
        type: DataTypes.STRING,
    },
    status_date: {
        type: DataTypes.DATE,
    },
    reason: {
        type: DataTypes.STRING,
    },
    set_reminder: {
        type: DataTypes.DATE,
    },
    reminder_date: {
        type: DataTypes.DATE,
    },
    reminder_text:{
        type:DataTypes.TEXT,
    },
    reference_check: {
        type: DataTypes.BOOLEAN,
    },
    reference_check_text: {
        type: DataTypes.STRING,
    },
    special_comments: {
        type: DataTypes.STRING,
    },
    basic_comments: {
        type: DataTypes.STRING,
    },
    ref_check: {
        type: DataTypes.STRING,
    },
    added_by:{
        type:DataTypes.STRING,
    },
    last_updated:{
        type:DataTypes.DATE
    },

}, {
    tableName: 'discussionplus',
    timestamps: true,
});

module.exports = Discussion_plus;