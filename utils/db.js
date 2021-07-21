const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on("connect", () => {
  console.log("Connection to Database Successful");
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
