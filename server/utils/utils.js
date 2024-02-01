const crypto = require('crypto');
const { request } = require('express');

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

    // console.log(requestCopy);

    const formatHeaders = (headers) => {
      const formattedHeaders = {};
      for (let i = 0; i < headers.length; i += 2) {
        formattedHeaders[headers[i]] = headers[i + 1];
      }
      return formattedHeaders;
    };

    console.log({
      method: requestCopy.method,
      headers: formatHeaders(requestCopy.rawHeaders),
      query: requestCopy.query,
      params: requestCopy.params,
      cookies: requestCopy.cookies,
      body: requestCopy.body,
    });


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

