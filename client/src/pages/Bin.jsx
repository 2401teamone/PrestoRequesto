import { useState, useEffect } from 'react'
import { useParams } from 'wouter';

import Logs from '../components/Logs.jsx'
import LogInfo from '../components/LogInfo.jsx'
import BinInterface from '../components/BinInterface.jsx'

import api from '../api/api.js'

export default function Bin() {
  const { endpoint } = useParams()
  const [logs, setLogs] = useState([])
  const [currentLog, setCurrentLog] = useState(null)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const url = `http://localhost:3000/endpoint/${endpoint}`

  useEffect(() => {
    const getLogs = async () => {
      const res = await api.getLogs(endpoint)
      return res
    }

    getLogs().then(({ status, message, payload }) => {
      if (status === 200) setLogs(payload.logs)
      else setError(message)
    })
  }, [endpoint])

  const copy = () => {
    setCopied(true)
    window.navigator.clipboard.writeText(url)
    setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  const handleSelectLog = async id => setCurrentLog(id)

  return (
    <div className="bin">
      {
        error.length ?
        error :
        <div>
          <div className="url-provider">
              Your Pastebin URL is <span className="url">{url}</span>
              <button className="copy" onClick={copy}><i className="fa-light fa-copy"></i> <span className="copy-notification">{copied && "copied"}</span></button>
          </div>
          
          <div className="content">
            <div className="left">
              <Logs logs={logs} currentLog={currentLog} handleSelectLog={handleSelectLog}/>
            </div>
            <div className="right">
              {
                currentLog === null ?
                <BinInterface url={url}/> :
                <LogInfo logId={currentLog} logs={logs} setCurrentLog={setCurrentLog}/>
              }
            </div>
          </div>
        </div>
      }
    </div>
  )
}

