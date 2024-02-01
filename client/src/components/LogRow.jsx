import { useParams } from 'wouter'

import { format } from 'date-fns'
import api from '../api/api.js'

export default function LogRow({ log, onClick, active }) {
  const { endpoint } = useParams();

  const handleDelete = async (event) => {
    event.stopPropagation();
    await api.removeLog(
      endpoint,
      log.id,
      log.mongo_id
    )
  }
  return (
    <div className={`log-row ${active ? "active" : ""}`}  onClick={onClick}>
      <div className="log-row-timestamp">{format(log.received_at, 'hh:mm:ssaaa')}</div>
      <div className="log-row-method">{log.method.toUpperCase()}</div>
      <div className="log-row-path">/{log.path}</div>
      <button className="delete-row-button" onClick={event => handleDelete(event)}>
        <i className="fa-sharp fa-light fa-trash"></i>
      </button>
    </div>
  )
}