import { useState, useEffect } from 'react'

import { CodeBlock } from 'react-code-blocks'

import api from '../api/api.js'

export default function LogInfo({ logId, logs, setCurrentLog }) {
  const [log, setLog] = useState(null)

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
              <span className="section section-headers">Headers:</span>
              <ul className="headers-list">
                {log.headers ? (
                  Object.entries(log.headers).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                  ))
                ) : (
                  <li>N/A</li>
                )}
              </ul>
            </div>
            <div className="info">
              <span className="section section-body">Body:</span>
              <span className="body">
                {
                  JSON.stringify(log.body).length > 2 ?
                  <CodeBlock
                    text={JSON.stringify(log.body, null, 2)}
                    language={"JSON"}
                  />
                  :
                  "N/A"
                }
              </span>
            </div>
          </div>
        )
      }
    </div>
  )
}