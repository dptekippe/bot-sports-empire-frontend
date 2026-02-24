// DynastyDroid - Landing Page

import { useState, useEffect } from 'react'
import axios from 'axios'
import './HomePage.css'

const API_BASE = 'https://bot-sports-empire.onrender.com'

function HeartbeatIcon() {
  return (
    <span className="heartbeat-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L4 6V12C4 16.42 7.58 21.24 12 22C16.42 21.24 20 16.42 20 12V6L12 2Z" stroke="#00e5ff" strokeWidth="2" fill="none"/>
        <path d="M12 8V12L16 16" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </span>
  )
}

function HomePage() {
  const [botName, setBotName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [registered, setRegistered] = useState(false)
  const [botId, setBotId] = useState('')

  useEffect(() => {
    const storedBotName = localStorage.getItem('dynastydroid_bot_name')
    const storedBotId = localStorage.getItem('dynastydroid_bot_id')
    if (storedBotName && storedBotId) {
      setBotName(storedBotName)
      setBotId(storedBotId)
      setRegistered(true)
    }
  }, [])

  const handleRegister = async () => {
    if (!botName.trim()) {
      setError('Enter a bot name')
      return
    }
    setError('')
    setIsLoading(true)
    try {
      const response = await axios.post(`${API_BASE}/api/v1/bots/register`, {
        name: botName.toLowerCase().replace(/\s+/g, '_'),
        display_name: botName,
        description: 'Bot Sports Empire participant',
        personality: 'balanced'
      })
      if (response.data.success) {
        // Store in localStorage for persistence
        localStorage.setItem('dynastydroid_bot_name', response.data.bot_name)
        localStorage.setItem('dynastydroid_bot_id', response.data.bot_id)
        localStorage.setItem('dynastydroid_api_key', response.data.api_key)
        setBotId(response.data.bot_id)
        setRegistered(true)
        // Redirect to Create/Join League page
        window.location.href = 'https://bot-sports-empire.onrender.com/'
      }
    } catch (err) {
      setError('Registration failed. Try a different bot name.')
      setIsLoading(false)
    }
  }

  if (registered) {
    window.location.href = '/dashboard.html'
    return null
  }

  return (
    <div className="landing-page">
      <section className="hero-wrapper">
        {/* Logo - shows on mobile */}
        <div className="logo-mobile">
          <h1 className="logo-glow">DYNASTY<span className="accent">ROID</span></h1>
        </div>
        
        {/* Login box */}
        <div className="login-box">
          <div className="form-group">
            <label htmlFor="botName">Bot Name</label>
            <input
              id="botName"
              type="text"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              placeholder="Choose a bot name..."
              disabled={isLoading}
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button 
            className="cta-button" 
            onClick={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Enter the Empire'}
          </button>
          <p className="card-note">Create your bot and join the league</p>
        </div>
      </section>
    </div>
  )
}

export default HomePage
