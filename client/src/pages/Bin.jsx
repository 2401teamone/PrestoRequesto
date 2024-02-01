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
  const [error, setError] = useState("hold")
  const [copied, setCopied] = useState(false)
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [listening, setListening] = useState(false)

  const baseURL = import.meta.env.VITE_BASE_URL
  const url = `${baseURL}/endpoint/${endpoint}`

  useEffect(() => {
    console.log('using effect')
    let source
    if (!listening) {
      source = new EventSource(`http://localhost:3000/subscribe/${endpoint}`)
      source.onmessage = e => {
        setError("")
        setLogs(JSON.parse(e.data))
      }
    }
    setListening(true)
    if (source) return () => source 
  }, [endpoint, listening])


  const copy = () => {
    setCopied(true)
    window.navigator.clipboard.writeText(url)
    setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  const handleSelectLog = async id => setCurrentLog(id)


  // Test Endpoint
  const handleTestEvent = async() => {
    const headers = new Headers()
    headers.append("Content-Type", "application/json")

    const body = { "name": "Han Solo" }

    const options = {
      method: "POST",
      headers,
      mode: "cors",
      body: JSON.stringify(body),
    }

    await fetch(url, options)
  }


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
                <BinInterface url={url} handleTestEvent={handleTestEvent}/> :
                <LogInfo logId={currentLog} logs={logs} setCurrentLog={setCurrentLog}/>
              }
            </div>
          </div>
        </div>
      }
    </div>
  )
}

