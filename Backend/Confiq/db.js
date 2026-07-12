// Config/db.js

const { Sequelize } = require('sequelize');

const databaseUrl = process.env.DATABASE_URL || process.env.DB_URL || 'mysql://root:kTmYOWfuKbpBFjGCcMyDLLWRQgkhucnb@hayabusa.proxy.rlwy.net:20195/railway';

const sequelize = new Sequelize(databaseUrl, {
    dialect: 'mysql',
    logging: false,
});

module.exports = sequelize;