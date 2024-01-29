const express = require("express");
const app = express();
const crypto = require('crypto');
const { dbQuery } = require("./db-query");
const port = 3000;

app.use('/', express.static('dist'));
app.use('/:bin_id', express.static('dist'));

app.get("/", (req, res) => {
  console.log('Hello Wold');
});

function generateEndpoint() {
  const currentTimestamp = new Date().toISOString();
  const randomValue = Math.random().toString();
  const dataToHash = currentTimestamp + randomValue;

  const endpoint = crypto.createHash('md5').update(dataToHash).digest('hex');
  return endpoint;
}

//Create bin button
app.post("/api/bin", async (req, res) => {
  //create the unique hash / id
  const endpoint = generateEndpoint();
  console.log('New endpoint:', endpoint);

  //Create a record in the database (create the endpoint)
  const query = "INSERT INTO bin (endpoint) VALUES ($1);";
  try {
    await dbQuery(query, endpoint);

    console.log("bin Created");

    res.json(endpoint);
  } catch (error) {
    console.log(error);

    res.status(500).json({message: "Internal Server Error. Could not create bin"});
  }
  //return the binId
});

// Get bin page where the user can view their logged HTTP requests
app.get('/api/bin/:endpoint/logs', (req, res) => {
  //query Postgres log table for the given endpoint

  //return a 404 if there is no endpoint found

  //return the log entries as JSON
});

// Get the detailed Request JSON from mongo
app.get('/api/bin/:bin_id/logs/:log_id', (req, res) => {
  //query mongo for the http request details

  //return them
});

// Collection route
app.all('/endpoint/:endpoint/:path*?', async (req, res) => {
  // Collect meta data from the request
  let {endpoint, path} = req.params;
  const method = req.method;

  // Append path remaining path if it exists
  path = req.params['0'] ? path + req.params['0'] : path;

  // Check with postgres that this bin exists
  try {
    const query = 'SELECT * FROM bin WHERE endpoint = $1;';
    let result = await dbQuery(query, endpoint);

    if (result.rowCount === 0) {
      throw new Error("No Bin ID Found");
    }

    // If it does exist, insert the http request into mongo - TODO

    // Insert into postgres
    const insert = `INSERT INTO log (bin_id, method, path)
    VALUES($1, $2, $3)`;

    await dbQuery(insert, result.rows[0].id, method, path);
    console.log('Log inserted');

    // Use server sent event to update front end - TODO

    // Send 200 ok
    res.sendStatus(200);

  } catch (error) {
    console.log(error);
    // Send a 404 response if the bin does not exist
    if (error.message === "No Bin ID Found") {
      return res.status(404).json({message: "Could not find bin"});
    } else {
      // Send a 500 response if inserting the request into the log table fails
      return res.status(500).json({message: "Internal Server Error"});
    }
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});