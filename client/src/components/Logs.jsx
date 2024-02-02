import { useState } from 'react'
import { useParams } from 'wouter'
import api from '../api/api.js'

import LogRow from './LogRow.jsx'
import Search from './ui/Search.jsx'

export default function Logs({ logs, currentLog, handleSelectLog, handleAnyDelete }) {
  const [term, setTerm] = useState("")

  const { endpoint } = useParams()

  const renderedLogs = logs
    .filter(log => {
      if (term.length === 0) return true

      return (
        log.method.toLowerCase().includes(term) ||
        (log.path && log.path.includes(term))
      )
    })
    .map(log => <LogRow key={log.id} log={log} active={currentLog === log.id} onClick={() => handleSelectLog(log.id)} handleAnyDelete={handleAnyDelete}/>)

  const handleSearch = val => setTerm(val)

  const handleRemoveAll = async() => {
    handleAnyDelete()
    await api.removeLogs(logs[0].bin_id, endpoint)
  }

  return (
    <div className="logs">
      <h2 className="header">Logs</h2>
      <Search term={term} handleSearch={handleSearch}/>
      <div className="log-rows">
        {renderedLogs}
      </div>
      <div>
        {logs.length !== 0 &&(<button className="delete-all-logs-button" onClick={handleRemoveAll}>Delete All</button>)}
      </div>
    </div>
  )
}