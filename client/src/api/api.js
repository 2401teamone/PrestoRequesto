import axios from 'axios'

const base = 'http://localhost:3000/api'

const api = {
  async createBin() {
    try {
      const res = await axios.post(`${base}/bin`)
      return res.data
    } catch (err) {
      return err.response.data
    }
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
    try {
      const res = await axios.get(`${base}/bin/log/${mongoId}`)
      return res.data
    } catch (err) {
      return err.response.data
    }
  },
  async removeLog(endpoint, logId, mongoId) {
    try {
      const res = await axios.delete(`${base}/bin/${endpoint}/log/${logId}/${mongoId}`)
      return res.data;
    } catch (err) {
      return err.response.data
    }
  },
  async removeLogs(binId, endpoint) {
    try {
      const res = await axios.delete(`${base}/bin/${binId}/${endpoint}/log`)
      return res.data;
    } catch (err) {
      return err.response.data
    }
  }
}

export default api