import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [apiStatus, setApiStatus] = useState('checking')
  const [error, setError] = useState(null)

  useEffect(() => {
    checkApiHealth()
  }, [])

  const checkApiHealth = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL.replace('/api', '/api/health'))
      if (response.ok) {
        setApiStatus('connected')
      } else {
        setApiStatus('error')
        setError('API returned status: ' + response.status)
      }
    } catch (err) {
      setApiStatus('error')
      setError(err.message)
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Ticket Management System</h1>
      <div style={{ marginTop: '1rem', fontSize: '18px' }}>
        <strong>API Status: </strong>
        <span style={{
          color: apiStatus === 'connected' ? 'green' : apiStatus === 'checking' ? 'orange' : 'red'
        }}>
          {apiStatus === 'connected' && '✓ Connected'}
          {apiStatus === 'checking' && '⏳ Checking...'}
          {apiStatus === 'error' && `✗ ${error}`}
        </span>
      </div>
      <div style={{ marginTop: '2rem', color: '#666' }}>
        <p>Frontend is running on port 5173</p>
        <p>API URL: {import.meta.env.VITE_API_BASE_URL}</p>
      </div>
    </div>
  )
}

export default App
