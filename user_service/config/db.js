const { Pool, Query } = require('pg');
require('dotenv').config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.on("connect", () => {
    console.log("connect to the db");
});

module.exports = {
    query: (text, params) => pool.query(text, params)
};
