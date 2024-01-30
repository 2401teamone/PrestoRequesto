import { useState, useEffect, useRef } from 'react'

export default function useTypingEffect(text, duration) {
  const [currentPosition, setCurrentPosition] = useState(0)
  const currentPositionRef = useRef(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPosition(val =>  val + 1)
      currentPositionRef.current += 1
      if (currentPositionRef.current >= text.length) clearInterval(intervalId)
    }, duration)

    return () => {
      clearInterval(intervalId)
      currentPositionRef.current = 0
      setCurrentPosition(0)
    }
  }, [duration, text])

  return (
    <div>
      {text.substring(0, currentPosition)}
    </div>
  )
}