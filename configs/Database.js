const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

dotenv.config();

const db = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  dialect: process.env.DB_CONNECTION || 'mariadb',
  dialectOptions: {
    typeCast: true
  },
  timezone: process.env.TIMEZONE || 'Asia/Makassar',
  // logging: false
});

module.exports = db;