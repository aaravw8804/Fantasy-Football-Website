// App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import LiveMatches from './components/LiveMatches'
import MonthlyFixturesTab from './components/MonthlyFixturesTab'
import Login from './components/Login'
import Leaderboard from './components/Leaderboard'
import FieldFormation from './components/FieldFormation'
import Navbar from './components/Navbar'
import Rules from './components/Rules'
import MyStatsPage from './components/MyStatsPage';


function App() {
  return (
    <>
      <Navbar />

      {/* Carousel with margin-top to avoid overlap by fixed navbar */}
      
      {/* Page Content */}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fixtures" element={<MonthlyFixturesTab />} />
          <Route path="/formation/:fixtureId" element={<FieldFormation />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/my-stats" element={<MyStatsPage />} />

          {/* Uncomment or add routes as needed */}
          {/* <Route path="/" element={<Dashboard />} />
          <Route path="/live" element={<LiveMatches />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> */}
        </Routes>
      </div>
    </>
  )
}

export default App
