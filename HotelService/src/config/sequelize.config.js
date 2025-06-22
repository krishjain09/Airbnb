require('ts-node/register') // This will enables TypeScript Support
const sequelize = require('./db.config');
module.exports = sequelize;