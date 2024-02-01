import axios from 'axios'

const baseURL = import.meta.env.VITE_BASE_URL
const baseAPI = `${baseURL}/api`

const api = {
  async createBin() {
    try {
      const res = await axios.post(`${baseAPI}/bin`)
      return res.data
    } catch (err) {
      return err.response.data
    }
  },
  async createLog(endpoint) {
    try {
      const res = await axios.get(`${baseURL}/endpoint/${endpoint}`)
      return res.data
    } catch (err) {
      return err.response.data
    }
  },
  async getLogs(endpoint) {
    try {
      const res = await axios.get(`${baseAPI}/bin/${endpoint}/logs`)
      return res.data
    } catch (err) {
      return err.response.data
    }
  },
  async getLog(mongoId) {
    try {
      const res = await axios.get(`${baseAPI}/bin/log/${mongoId}`)
      return res.data
    } catch (err) {
      return err.response.data
    }
  },
  async removeLog(endpoint, logId, mongoId) {
    try {
      const res = await axios.delete(`${baseAPI}/bin/${endpoint}/log/${logId}/${mongoId}`)
      return res.data;
    } catch (err) {
      return err.response.data
    }
  },
  async removeLogs(binId, endpoint) {
    try {
      const res = await axios.delete(`${baseAPI}/bin/${binId}/${endpoint}/log`)
      return res.data;
    } catch (err) {
      return err.response.data
    }
  }
}

export default api