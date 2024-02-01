import axios from 'axios'

const baseURL = import.meta.env.VITE_BASE_URL
const baseAPI = `${baseURL}/api`

const api = {
  async createBin() {
    const res = await axios.post(`${baseAPI}/bin`)
    return res.data
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
    const res = await axios.get(`${baseAPI}/bin/log/${mongoId}`)
    return res.data
  },
  async removeLog(binId, logId, mongoId) {
    const res = await axios.delete(`${baseAPI}/bin/${binId}/log/${logId}/${mongoId}`)
    return res.data;
  },
  async removeLogs(binId) {
    const res = await axios.delete(`${baseAPI}/bin/${binId}/log`)
    return res.data;
  }
}

export default api