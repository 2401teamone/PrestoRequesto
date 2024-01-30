import { useState, useEffect } from 'react'

import api from '../api/api.js'

export default function LogInfo({ logId, logs }) {
  const [log, setLog] = useState(null)

  useEffect(() => {
    const getLog = async (mongo_id) => {
      const result = await api.getLog(mongo_id)
      return result
    }

    let sqlData = logs.find(log => log.id === logId)
    console.log(sqlData)
    let mongoData = getLog(sqlData.mongo_id)
    console.log(mongoData)
    // const log = {
    //   body: res.data.log.body,
    //   ...sqlLog
    // }

    setLog(sqlData)

  }, [logId])


  return (
    <div className="log-info">
      <h2>HTTP Request</h2>
      <br/>
      {
        log && 
        (
          <div>
            <div>
              Details: <span>{log.method}</span><span>{log.path}</span>
            </div>
            <div>
              Headers:
            </div>
            <div>
              Body:
            </div>
          </div>
        )
      }
    </div>
  )
}