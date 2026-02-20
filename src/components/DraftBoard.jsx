// DynastyDroid - Draft Board Component
// Phase 3 MVP - Interactive Draft Board

import { useState, useEffect } from 'react'
import axios from 'axios'
import './DraftBoard.css'

const API_BASE = 'https://bot-sports-empire.onrender.com'

function DraftBoard({ draftId, isCommissioner = false }) {
  const [draft, setDraft] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPlayer, setSelectedPlayer] = useState('')
  const [timer, setTimer] = useState(0)

  // Fetch draft
  const fetchDraft = async () => {
    if (!draftId) return
    try {
      const response = await axios.get(`${API_BASE}/api/v1/drafts/${draftId}`)
      setDraft(response.data)
      setTimer(response.data.timer_remaining)
      setLoading(false)
    } catch (err) {
      setError('Failed to load draft')
      setLoading(false)
    }
  }

  // Make a pick
  const makePick = async () => {
    if (!selectedPlayer || !draftId) return
    
    try {
      await axios.post(`${API_BASE}/api/v1/drafts/${draftId}/pick`, {
        bot_id: 'bot_demo',
        player_id: selectedPlayer,
        player_name: selectedPlayer,
        position: 'WR'
      })
      setSelectedPlayer('')
      fetchDraft()
    } catch (err) {
      setError('Failed to make pick')
    }
  }

  // Toggle pause (commissioner only)
  const togglePause = async () => {
    if (!isCommissioner || !draftId) return
    try {
      await axios.post(`${API_BASE}/api/v1/drafts/${draftId}/pause`)
      fetchDraft()
    } catch (err) {
      setError('Failed to toggle pause')
    }
  }

  useEffect(() => {
    fetchDraft()
    const interval = setInterval(fetchDraft, 5000) // Poll every 5s
    return () => clearInterval(interval)
  }, [draftId])

  // Timer countdown
  useEffect(() => {
    if (!draft || draft.paused) return
    const interval = setInterval(() => {
      setTimer(t => t > 0 ? t - 1 : 0)
    }, 1000)
    return () => clearInterval(interval)
  }, [draft])

  if (loading) return <div className="draft-loading">Loading draft...</div>
  if (error) return <div className="draft-error">{error}</div>
  if (!draft) return <div className="draft-error">No draft found</div>

  const currentPick = draft.pick_order?.[draft.current_pick]
  const isMyTurn = true // Demo: always allow picks

  return (
    <div className="draft-board">
      <div className="draft-header">
        <h1>🏈 {draft.name}</h1>
        <div className="draft-status">
          {draft.paused ? (
            <span className="status paused">⏸️ PAUSED</span>
          ) : (
            <span className="status live">🔴 LIVE</span>
          )}
          <span className="round">Round {currentPick?.round || 1}</span>
        </div>
      </div>

      {/* Timer */}
      <div className="draft-timer">
        <div className="timer-circle">
          <span className={`timer-value ${timer < 30 ? 'warning' : ''}`}>
            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </span>
        </div>
        {isCommissioner && (
          <button onClick={togglePause} className="pause-btn">
            {draft.paused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
        )}
      </div>

      {/* Picks Grid */}
      <div className="picks-grid">
        {draft.pick_order?.map((pick, idx) => (
          <div 
            key={idx} 
            className={`pick-card ${idx === draft.current_pick ? 'current' : ''} ${pick.player ? 'filled' : 'empty'}`}
          >
            <div className="pick-number">#{pick.pick}</div>
            <div className="pick-team">Team {pick.team_id}</div>
            <div className="pick-player">
              {pick.player?.player_name || '---'}
            </div>
            {pick.player?.position && (
              <span className="position-badge">{pick.player.position}</span>
            )}
          </div>
        ))}
      </div>

      {/* Make Pick (Demo) */}
      <div className="pick-controls">
        <h3>Make a Pick</h3>
        <div className="pick-input">
          <input
            type="text"
            placeholder="Player name..."
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
          />
          <button onClick={makePick} disabled={!selectedPlayer}>
            Submit Pick
          </button>
        </div>
      </div>

      {/* Draft Info */}
      <div className="draft-info">
        <p>{draft.rounds} rounds • {draft.teams?.length || 0} teams • {draft.is_snake ? 'Snake' : 'Linear'} draft</p>
      </div>
    </div>
  )
}

export default DraftBoard
