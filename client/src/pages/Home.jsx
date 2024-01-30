import { useState } from 'react'
import { useLocation } from 'wouter'

import Button from '../components/ui/Button.jsx'
import Loading from '../components/ui/Loading.jsx'

import api from '../api/api.js'


export default function Home() {
  const [_, setLocation] = useLocation()
  const [initiated, setInitiated] = useState(false)

  const initiateBin = async () => {
    setInitiated(true)
    const newBin = api.createBin()
    const timer = new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 2000)
    })

    Promise.all([newBin, timer]).then(([newBin]) => {
      setLocation(newBin.payload.endpoint)
    })
  }

  return (
    <div className="home">
      <Button text="INITIATE BIN" handleClick={initiateBin}/>
      {initiated && <Loading />}
    </div>
  )
}