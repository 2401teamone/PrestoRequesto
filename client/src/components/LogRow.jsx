import { format } from 'date-fns'

export default function LogRow({ log, onClick, active }) {
  return (
    <div className={`log-row ${active ? "active" : ""}`}  onClick={onClick}>
      <div className="log-row-timestamp">{format(log.received_at, 'hh:mm:ssaaa')}</div>
      <div className="log-row-method">{log.method.toUpperCase()}</div>
      <div className="log-row-path">/{log.path}</div>
    </div>
  )
}