const PG = require('./db/pg.js')

const clients = {}

const subscribe = async (req, res, next) => {
  const { endpoint } = req.params;

  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  }

  res.writeHead(200, headers);

  const currentRequests = await PG.getLogsByEndpoint(endpoint);

  const data = `data: ${JSON.stringify(currentRequests)}\n\n`

  clients[endpoint] = res;

  req.on('close', () => {
    console.log(`${endpoint} closed`);
    delete clients[endpoint]
  })
}

const sendEventToClient = async (endpoint) => {
  const updatedRequests = await PG.getLogsByEndpoint(endpoint)
  clients[endpoint].write(`data: ${JSON.stringify(updatedRequests)}`)
}

module.exports = {
  clients,
  subscribe,
  sendEventToClient
}