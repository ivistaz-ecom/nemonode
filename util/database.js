const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.MYSQL_SCHEMA_NAME,process.env.MYSQL_USER_NAME,process.env.MYSQL_PASSWORD, {
    dialect: "mysql",
    port:3307,
    host: process.env.MYSQL_HOST,
})

module.exports = sequelize;