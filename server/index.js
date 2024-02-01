// npm packages
const express = require("express");
const morgan = require('morgan');
const cors = require('cors')

// db operations
const mongo = require('./db/mongo-query');
const { dbQuery } = require("./db/db-query");
const PG = require('./db/pg.js')

// utilities
const catchError = require('./utils/catch-error.js');
const AppError = require('./utils/app-error.js');

const {
  packagePayload,
  generateEndpoint,
  getJSONRequest
} = require('./utils/utils.js')

const {
  subscribe,
  clients,
  sendEventToClient,
} = require('./events.js')

const port = 3000;

const app = express();

// middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serve static files
app.use('/', express.static('dist'));
app.use('/:bin_id', express.static('dist'));

/*
Creates a new bin when 'Initiate Bin' button is clicked
Redirects user to their bin page
Bin endpoint is generated via a utility function
*/
app.post("/api/bin", catchError(async (req, res) => {
  const endpoint = generateEndpoint();
  await PG.createBin(endpoint);
  res.json(packagePayload(
    200,
    "Bin created",
    { endpoint }
  ));
}));

/*
subscribe
*/
app.get('/subscribe/:endpoint', subscribe)

/*
Get logs associated with specific bin endpoint
If no bin for that endpoint, reroutes to err page
*/
app.get('/api/bin/:endpoint/logs', catchError(async (req, res) => {
  const { endpoint } = req.params;
  if (!endpoint) throw new AppError(404, "No endpoint received with this request...")

  const foundBin = await PG.getBin(endpoint);
  if (!foundBin) throw new AppError(404, "No bin found for that endpoint");

  const requests = await PG.getLogsByBinId(foundBin.id);

  res.status(200).json(packagePayload(
    200,
    "Bin logs retrieved",
    { logs: requests }
  ))
}));

/*
Provides detailed log info by accessing its mongo document
*/
app.get('/api/bin/log/:mongo_id', catchError(async (req, res) => {
  let { mongo_id: mongoId } = req.params;
  let mongoDoc = await mongo.find('requests', mongoId);
  if (!mongoDoc) throw new AppError(400, "No Request Found");

  res.json(packagePayload(
    200,
    "Request retrieved",
    { request : mongoDoc.JSONRequest }
  ));
}));

/*
Delete a single request from a given bin's log
*/
app.delete('/api/bin/:endpoint/log/:log_id/:mongo_id', catchError(async (req, res) => {
  const { endpoint, log_id: logId, mongo_id: mongoId } = req.params;
  await mongo.remove("requests", mongoId);
  await PG.deleteLog(logId)
  
  res.json(packagePayload(
    200, 
    "Log Deleted"
  ));

  return sendEventToClient(endpoint);
}));

/*
Delete all the requests from a given bin's log
*/
app.delete('/api/bin/:bin_id/:endpoint/log', catchError(async (req, res) => {
  const { bin_id: binId, endpoint } = req.params;
  await mongo.removeAll("requests", binId);
  await PG.deleteAllLogs(binId)
  
  res.json(packagePayload(
    200,
    "All Logs Deleted"
  ));

  return sendEventToClient(endpoint);
}))

/*
Collect new logs via provided endpoint
*/
app.all('/endpoint/:endpoint/:path*?', async (req, res) => {
  // query string???
  let { endpoint, path } = req.params;
  path = req.params['0'] ? path + req.params['0'] : path;
  const method = req.method;

  const JSONRequest = getJSONRequest(req);

  const foundBin = await PG.getBin(endpoint);
  if (!foundBin) throw new AppError(404, "No bin found for that endpoint");

  const mongoDoc = {
    bin_id: foundBin.id,
    JSONRequest
  }
  const mongo_id = await mongo.insert('requests', mongoDoc);
  if (!mongo_id) throw new AppError(404, "Failed to create the associated mongo resource");

  const newLog = await PG.createLog(foundBin.id, method, path, mongo_id);

  res.json(packagePayload(
    200,
    "Request logged",
    { log: newLog }
  ));

  return sendEventToClient(endpoint)
});

app.all('*', (req, res, next) => {
  const err = new Error(`Cannot find ${req.originalURL} on this server...`);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  err.status = err.status || 500;

  res
    .status(err.status)
    .json(packagePayload(err.status, err.message))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});