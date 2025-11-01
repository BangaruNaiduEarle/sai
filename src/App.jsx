import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import SAIBoxingDashboard from './sai_boxing'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SAIBoxingDashboard />
    </>
  )
}

export default App
