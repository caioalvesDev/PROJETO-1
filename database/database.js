const Sequelize = require('sequelize');
require('dotenv').config();

const connection = new Sequelize(process.env.DB_NAME, process.env.LOGIN_DB, process.env.PASSWORD,{
    host: process.env.HOST,
    dialect: process.env.DIALECT
});

module.exports = connection;