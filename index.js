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

function generateUniqueHash() {
  const currentTimestamp = new Date().toISOString();
  const randomValue = Math.random().toString();
  const dataToHash = currentTimestamp + randomValue;

  const hash = crypto.createHash('md5').update(dataToHash).digest('hex');
  return hash;
}

//Create bin button
app.post("/api/bin", async (req, res) => {
  //create the unique hash / id
  const uniqueHash = generateUniqueHash();
  console.log('UniqueHash:', uniqueHash);

  //create a record in the database (create the binId)
  const query = "INSERT INTO bin (bin_id) VALUES ($1);";
  try {
    await dbQuery(query, uniqueHash);
    console.log("bin Created");

    res.json(uniqueHash);
  } catch (error) {

    console.log(error);
    res.status(404).json({message: "Could not create bin"});
  }
  //return the binId
});

// the user's "home page" / bin page where they see all their logs
app.get('/api/bin/:bin_id/logs', (req, res) => {
  //query Postgres log table for the given bin_id

  //return a 404 if there is no bin_id found

  //return the log entries as JSON
});

// pulling the detailed Request data from mongo
app.get('/api/bin/:bin_id/logs/:log_id', (req, res) => {
  //query mongo for the http request details

  //return them
});

// Collection route
app.all('/endpoint/:bin_id/:path*?', async (req, res) => {
  //check with postgres that this bin exists
  let {bin_id, path} = req.params;
  path = req.params['0'] ? path + req.params['0'] : path;
  console.log(req.params);
  const method = req.method;
  try {
    const query = 'SELECT * FROM bin WHERE bin_id = $1;';
    let result = await dbQuery(query, bin_id);

    if (result.rowCount === 0) {
      throw new Error("No Bin ID found");
    }

    const insert = `INSERT INTO log (bin_id, method, path)
    VALUES($1, $2, $3)`;

    await dbQuery(insert, result.rows[0].id, method, path);
    console.log('Log inserted');

  } catch (error) {
    console.log(error);
  }
    //if it does exist, insert the http request into mongo
    //insert into postgres

    //server sent event to update front end
    //return 200 OK

  //Else return 404
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});