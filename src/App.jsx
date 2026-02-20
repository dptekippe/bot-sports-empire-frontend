import { useState, useEffect } from 'react'
import HomePage from './components/HomePage'
import DraftBoard from './components/DraftBoard'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('home')
  
  // For MVP, show home page. Toggle to 'draft' to see draft board
  // return <DraftBoard draftId="draft_demo" isCommissioner={true} />
  
  return <HomePage />
}

export default App
