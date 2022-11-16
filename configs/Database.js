import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const db = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  dialect: process.env.DB_CONNECTION || 'mysql',
  dialectOptions: {
    dateString: true,
    typeCast: true
  },
  timezone: process.env.TIMEZONE || 'Asia/Makassar'
});

export default db;