const { dbQuery } = require('./db-query.js');

class PG {
  async createBin(endpoint) {
    const createBinQuery = `INSERT INTO bin (endpoint) VALUES ($1);`;
    await dbQuery(createBinQuery, endpoint);
  }

  async getBin(endpoint) {
    const getBinQuery = 'SELECT * FROM bin WHERE endpoint = $1;';
    const res = await dbQuery(getBinQuery, endpoint);
    return res.rows[0];
  }

  async getLogsByBinId(binId) {
    const getAllRequestsQuery = `SELECT * FROM log WHERE bin_id = $1;`;
    const requests = await dbQuery(getAllRequestsQuery, binId);
    return requests.rows;
  }

  async getLogsByEndpoint(endpoint) {
    const getAllRequestsQuery = `SELECT * FROM log WHERE endpoint = $1;`;
    const requests = await dbQuery(getAllRequestsQuery, endpoint);
    return requests.rows;
  }

  async createLog(binId, method, path, mongoId) {
    const insertQuery = `
      INSERT INTO log (bin_id, method, path, mongo_id)
      VALUES($1, $2, $3, $4) RETURNING *
    `;

    const res = await dbQuery(insertQuery, binId, method, path, mongoId);
    return res.rows[0];
  }

  async deleteLog(logId) {
    const deleteQuery = `DELETE FROM log WHERE id = $1`;
    const results = await dbQuery(deleteQuery, logId);
  }

  async deleteAllLogs(binId) {
    const deleteAllQuery = `DELETE FROM log WHERE bin_id = $1`;
    await dbQuery(deleteAllQuery, binId);
  }

}

module.exports = new PG();