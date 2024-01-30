import { format } from 'date-fns'
import api from '../api/api.js'

export default function LogRow({ log, onClick, active, onRefresh }) {
  const handleDelete = async (event) => {
    event.stopPropagation();
    await api.removeLog(log.bin_id, log.id, log.mongo_id)
    onRefresh();
  }
  return (
    <div className={`log-row ${active ? "active" : ""}`}  onClick={onClick}>
      <div className="log-row-timestamp">{format(log.received_at, 'hh:mm:ssaaa')}</div>
      <div className="log-row-method">{log.method.toUpperCase()}</div>
      <div className="log-row-path">/{log.path}</div>
      <button onClick={event => handleDelete(event)}>X</button>
    </div>
  )
}