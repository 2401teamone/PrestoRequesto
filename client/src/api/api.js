import axios from 'axios'

const base = 'http://localhost:3000/api'

const api = {
  async createBin() {
    const res = await axios.post(`${base}/bin`)
    console.log(res)
    return res.data
  },
  async getLogs(endpoint) {
    const res = await axios.get(`${base}/bin/${endpoint}/logs`)
    
    return res.data
  },
  async getLog(mongoId) {
    const res = await axios.get(`${base}/bin/log/${mongoId}`)
    return res.data
  }
}

export default api