const path = require('path')
require('dotenv').config()
module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": "localhost",
    "dialect": "postgres",
    "migrationStorage": "json",
    "migrationStoragePath": path.resolve("db","migrations","sequelizeMeta.json"),
    "logging": false
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "localhost",
    "dialect": "mysql"
  }
}
