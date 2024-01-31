import axios from 'axios'

const base = 'http://localhost:3000/api'

const api = {
  async createBin() {
    const res = await axios.post(`${base}/bin`)
    return res.data
  },
  async createLog(endpoint) {
    try {
      const res = await axios.get(`http://localhost:3000/endpoint/${endpoint}`)
      return res.data
    } catch (err) {
      return err.response.data
    }
  },
  async getLogs(endpoint) {
    try {
      const res = await axios.get(`${base}/bin/${endpoint}/logs`)
      return res.data
    } catch (err) {
      return err.response.data
    }
  },
  async getLog(mongoId) {
    const res = await axios.get(`${base}/bin/log/${mongoId}`)
    return res.data
  },
  async removeLog(binId, logId, mongoId) {
    const res = await axios.delete(`${base}/bin/${binId}/log/${logId}/${mongoId}`)
    return res.data;
  },
  async removeLogs(binId) {
    const res = await axios.delete(`${base}/bin/${binId}/log`)
    return res.data;
  }
}

export default api