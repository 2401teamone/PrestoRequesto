// const config = require("./config");
require("dotenv").config()

const { Client } = require("pg");

const logQuery = (statement, parameters) => {
  let timeStamp = new Date();
  let formattedTimeStamp = timeStamp.toString().substring(4, 24);
  console.log(formattedTimeStamp, statement, parameters);
};

// const isProduction = (config.NODE_ENV === "production");
const CONNECTION = {
  connectionString: `postgres://${process.env.DB_USERANDPASS}@localhost:5432/main`,
  //ssl: isProduction,  // See note below
  // ssl: { rejectUnauthorized: false },
  // ssl: isProduction ? { rejectUnauthorized: false } : false
};

// console.log(CONNECTION.connectionString);

module.exports = {
  async dbQuery(statement, ...parameters) {
    let client = new Client(CONNECTION);

    await client.connect();
    logQuery(statement, parameters);
    let result = await client.query(statement, parameters);
    await client.end();

    return result;
  }
};