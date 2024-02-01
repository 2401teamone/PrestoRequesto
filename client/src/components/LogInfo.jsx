import { useState, useEffect } from 'react'

import { CodeBlock } from 'react-code-blocks'

import api from '../api/api.js'

export default function LogInfo({ logId, logs, setCurrentLog }) {
  const [log, setLog] = useState(null)
  const [headersVisible, setHeadersVisible] = useState(false);
  const [queryStringVisible, setQueryStringVisible] = useState(false);

  const toggleHeadersVisibility = () => {
    setHeadersVisible(!headersVisible);
  };

  const toggQueryStringVisibility = () => {
    setQueryStringVisible(!queryStringVisible);
  };

  useEffect(() => {
    const getLog = async (mongo_id) => {
      const result = await api.getLog(mongo_id)
      return result
    }

    let sqlData = logs.find(log => log.id === logId)

    if (sqlData !== undefined) {
      getLog(sqlData.mongo_id).then(({ payload }) => {
        const log = {
          body: payload.request.body,
          cookies: payload.request.cookies,
          headers: payload.request.headers,
          query: payload.request.query,
          ...sqlData
        }
        setLog(log)
      })
    }
  }, [logId, logs])

  return (
    <div className="log-info">
      <h2>HTTP Request</h2>
      <button className="back" onClick={() => setCurrentLog(null)}><i className="fa-sharp fa-regular fa-backward-step"></i></button>
      <br/>
      {
        log &&
        (
          <div>
            <div className="info">
              <span className="section section-details">Details: </span>
              <span className="details">
                <span className="method">
                  {log.method}
                </span>
                <span>
                  /{log.path}
                </span>
              </span>
            </div>
            <div className="info">
              <span className="section section-headers clickable"
                    onClick={toggleHeadersVisibility}>
                    Headers:({log.headers ? Object.keys(log.headers).length : 0})
              </span>
            </div>
            {headersVisible && log.headers && (
              <div className="info scrollable-table-container">
                <table className="headers-table">
                  <tbody>
                    {Object.entries(log.headers).map(([key, value]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="info">
              <span className={`section section-headers ${Object.keys(log.query).length > 0 ? 'clickable' : ''}`}
                    onClick={Object.keys(log.query).length > 0 ? toggQueryStringVisibility : () => {}}>
                    Query Parameters:({log.query ? Object.keys(log.query).length : 0})
              </span>
            </div>
            {queryStringVisible && log.query && (
              <div className="info scrollable-table-container">
                <table className="headers-table">
                  <tbody>
                    {Object.entries(log.query).map(([key, value]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="info">
              <span className="section section-body">Body: {JSON.stringify(log.body).length < 3 ? "N/A" : ''}</span>
            </div>
            {JSON.stringify(log.body).length > 2 &&
              (<div className="body">
                <CodeBlock
                  text={JSON.stringify(log.body, null, 2)}
                  language={"JSON"}
                />
              </div>)
            }
          </div>
        )
      }
    </div>
  )
}