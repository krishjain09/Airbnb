const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'krishjain123',
    database: process.env.DB_NAME || 'airbnb_dev',
    host: process.env.DB_HOST || '192.168.68.84',
    dialect: 'mysql'
  }
};
