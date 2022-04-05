const Client = require("pg").Pool;
require("dotenv").config();

const cliente = new Client({
  connectionString: process.env.DATABASE_URI,
  ssl: {
    rejectUnauthorized: false,
  },
});


module.exports = cliente;
