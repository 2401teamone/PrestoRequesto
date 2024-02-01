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
    
    const formatHeaders = (headers) => {
      const formattedHeaders = {};
      for (let i = 0; i < headers.length; i += 2) {
        formattedHeaders[headers[i]] = headers[i + 1];
      }
      return formattedHeaders;
    };

    return {
      method: requestCopy.method,
      headers: formatHeaders(requestCopy.rawHeaders),
      query: requestCopy.query,
      params: requestCopy.params,
      cookies: requestCopy.cookies,
      body: requestCopy.body,
    };
  }
};

