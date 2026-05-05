import { useState } from 'react'
import Header from './components/Header'
import Feed from './components/Feed'
import './App.css'

const SOURCES = [
  { id: 'all', label: 'All' },
  { id: 'hackernews', label: 'Hacker News' },
  { id: 'devto', label: 'Dev.to' },
  { id: 'lobsters', label: 'Lobsters' },
]

export default function App() {
  const [activeSource, setActiveSource] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="app">
      <Header
        sources={SOURCES}
        activeSource={activeSource}
        onSourceChange={setActiveSource}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main className="app__main">
        <Feed activeSource={activeSource} searchQuery={searchQuery} />
      </main>
    </div>
  )
}
