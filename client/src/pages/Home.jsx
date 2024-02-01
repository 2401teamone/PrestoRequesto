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
      <div className="home-content">
        <h1 className="welcome">Welcome to Presto Requesto!</h1>
        <p className="overview">
           With the simple click of a button, 
          you can create your own bin to collect
          and review <span className="highlight">webhooks</span> and <span className="highlight">HTTP Requests</span>.
        </p>
        <Button text="Create Bin" handleClick={initiateBin}/>
        {initiated && <Loading />}
      </div>
    </div>
  )
}