const express = require("express");
const app = express();
const crypto = require('crypto');
const { dbQuery } = require("./db-query");
const mongo = require('./mongo-query');
const morgan = require('morgan');
const port = 3000;

//morgan logging middleware
app.use(morgan('dev'));
//serve static files
app.use('/', express.static('dist'));
app.use('/:bin_id', express.static('dist'));
//json parsing middleware
app.use(express.json());


app.get("/", (req, res) => {
  console.log('Hello Wold');
});

//generates a new unique endpoint, using the current time and a random value
function generateEndpoint() {
  const currentTimestamp = new Date().toISOString();
  const randomValue = Math.random().toString();
  const dataToHash = currentTimestamp + randomValue;

  const endpoint = crypto.createHash('md5').update(dataToHash).digest('hex');
  return endpoint;
}

// Takes an express req object and returns a JSON representation of the received HTTP request
const getJSONRequest = req => {
  const requestCopy = {...req};

  return {
    method: requestCopy.method,
    headers: requestCopy.headers,
    query: requestCopy.query,
    params: requestCopy.params,
    cookies: requestCopy.cookies,
    body: requestCopy.body,
  };
};

//Create a new Bin / User endpoint
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
app.get('/api/bin/:bin_id/logs', async (req, res) => {
  bin_id = +req.params.bin_id;
  try {
    //check that a bin exists with the given bin_id
    const binCheckQuery = 'SELECT * FROM bin WHERE id = $1;';

    let result = await dbQuery(binCheckQuery, bin_id);

    if (result.rowCount === 0) {
      throw new Error("No Bin ID Found");
    }

    //Get the requests from the log table for the given bin_id
    const getAllRequestsQuery = `SELECT * FROM log WHERE bin_id = $1;`;

    requests = await dbQuery(getAllRequestsQuery, bin_id);

    //return the log entries as JSON
    res.json(requests.rows);

  } catch (error) {
    //return a 404 if there is no endpoint found
    if (error.message === "No Bin ID Found") {
      res.status(404).json({message: "Bin Not Found"});
      console.log(error);
    } else {
      console.log(error);
    }
  }
});

// Get the detailed Request JSON from mongo
app.get('/api/bin/:bin_id/log/:mongo_id', async (req, res) => {
  mongo_id = req.params.mongo_id;
  //query mongo for the http request details
  try {
    let JSONRequest = await mongo.find('requests', mongo_id);
    if (!JSONRequest) {
      throw new Error("No Request Found");
    }
    // Return the JSON request
    res.json(JSONRequest);
  } catch (error) {
    if (error.message === "No Request Found") {
      res.status(404).json({message: "Request Not Found"});

      console.log(error);
      //else if the error is a BSONError, send a 400
    } else if (error.name === "MongoError") {
      console.log(error);
      res.status(400).json({message: "Bad Reqeust"});
    }
  }
});

// Delete a single request from a given bin's log

// Delete all the requests from a given bin's log

// send a test request to a bin



// Collection route
app.all('/endpoint/:endpoint/:path*?', async (req, res) => {
  // Collect meta data from the request
  let {endpoint, path} = req.params;
  const method = req.method;
  const JSONRequest = getJSONRequest(req);
  console.log(JSONRequest);

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
    const mongo_id = await mongo.insert('requests', JSONRequest);

    // Insert into postgres
    const insert = `INSERT INTO log (bin_id, method, path, mongo_id)
    VALUES($1, $2, $3, $4)`;

    await dbQuery(insert, result.rows[0].id, method, path, mongo_id);
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