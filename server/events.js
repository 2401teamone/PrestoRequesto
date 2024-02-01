const PG = require('./db/pg.js')

let clients = []

const subscribe = async (req, res, next) => {
  const { endpoint } = req.params;

  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Content-Encoding': 'none',
    'Cache-Control': 'no-cache'
  }

  res.writeHead(200, headers);

  const currentRequests = await PG.getLogsByEndpoint(endpoint);

  const data = `data: ${JSON.stringify(currentRequests)}\n\n`
  res.write(data)

  let thisClientId = Date.now();

  let newClient = {
    id: thisClientId,
    endpoint,
    res
  }

  clients.push(newClient)

  req.on('close', () => {
    console.log(`${endpoint} closed`);
    clients = clients.filter(client => client.id !== thisClientId)
  })
}

const sendEventToClient = async (endpoint) => {
  let updatedRequests = await PG.getLogsByEndpoint(endpoint)
  clients.forEach(client => {
    if (client.endpoint === endpoint) {
      client.res.write(`data: ${JSON.stringify(updatedRequests)}\n\n`)
    }
  })
}

module.exports = {
  clients,
  subscribe,
  sendEventToClient
}