import { Route } from "wouter"

import './App.css'

import Home from './pages/Home.jsx'
import Bin from './pages/Bin.jsx'

function App() {
  return (
    <div className="app">
      <Route path="/" component={Home}/>
      <Route path="/:endpoint" component={Bin}/>
    </div>
  )
}

export default App