const crypto = require('crypto');

module.exports = {
  packagePayload(status, message, payload) {
    return { status, message, payload };
  },
  generateEndpoint() {
    const currentTimestamp = new Date().toISOString();
    const randomValue = Math.random().toString();
    const dataToHash = currentTimestamp + randomValue;
  
    const endpoint = crypto.createHash('md5').update(dataToHash).digest('hex');
    return endpoint;
  },
  getJSONRequest(req) {
    const requestCopy = {...req};
  
    return {
      method: requestCopy.method,
      headers: requestCopy.headers,
      query: requestCopy.query,
      params: requestCopy.params,
      cookies: requestCopy.cookies,
      body: requestCopy.body,
    };
  }
}

