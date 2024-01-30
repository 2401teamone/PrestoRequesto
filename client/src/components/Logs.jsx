import { useState } from 'react'

import LogRow from './LogRow.jsx'
import Search from './ui/Search.jsx'

export default function Logs({ logs, currentLog, handleSelectLog }) {
  const [term, setTerm] = useState("")

  const renderedLogs = logs
    .filter(log => {
      if (term.length === 0) return true
      
      return (
        log.method.toLowerCase().includes(term) ||
        (log.path && log.path.includes(term))
      )
    })
    .map(log => <LogRow key={log.id} log={log} active={currentLog === log.id} onClick={() => handleSelectLog(log.id)}/>)

  const handleSearch = val => setTerm(val)

  return (
    <div className="logs">
      <h2>Logs</h2>
      <Search term={term} handleSearch={handleSearch}/>
      <div className="log-rows">
        {renderedLogs}
      </div>
    </div>
  )
}