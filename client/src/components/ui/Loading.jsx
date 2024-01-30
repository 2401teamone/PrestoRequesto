import useTypingEffect from '../../hooks/typing-effect.jsx'

export default function Loading() {
  return (
    <div className="loading">
      {useTypingEffect("Initiating bin... Please hold.", 50)}
    </div>
  )
}