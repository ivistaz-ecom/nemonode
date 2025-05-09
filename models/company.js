
const Sequelize = require('sequelize')
const sequelize = require("../util/database")

const Company = sequelize.define("company", {
    company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    address:{
        type:Sequelize.STRING,
        allowNull:false
    },
    b_type: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    company_name:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    contact_person:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
    },

    phone:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    management:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    rpsl:{
        type:Sequelize.STRING,
        allowNull:true,
    },
    last_update:{
        type:Sequelize.DATE,
        allowNull:false
    }

    
},{timestamps:false});

module.exports = Company