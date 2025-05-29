// LiveMatches.jsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'

function LiveMatches() {
  const [liveData, setLiveData] = useState(null)
  const [eventId, setEventId] = useState(1)

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/fpl/live/${eventId}`)
        setLiveData(res.data)
      } catch (error) {
        console.error('Error fetching live match data:', error)
      }
    }
    fetchLiveData()
  }, [eventId])

  // If no data yet, show a loading message
  if (!liveData) {
    return <p>Loading live data...</p>
  }

  // The FPL live data often contains an "elements" array with player stats
  const { elements } = liveData
  if (!elements || !Array.isArray(elements)) {
    return <p>No live data available</p>
  }

  return (
    <div>
      <h2 className="mb-3">Live Matches for Event {eventId}</h2>
      
      {/* Example input to switch events */}
      <div className="mb-3">
        <label htmlFor="eventId" className="form-label">Event ID:</label>
        <input
          type="number"
          id="eventId"
          className="form-control"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
        />
      </div>

      {/* Table to display player stats */}
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Player ID</th>
            <th>Minutes</th>
            <th>Goals Scored</th>
            <th>Assists</th>
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {elements.map((element) => (
            <tr key={element.id}>
              <td>{element.id}</td>
              <td>{element.stats?.minutes}</td>
              <td>{element.stats?.goals_scored}</td>
              <td>{element.stats?.assists}</td>
              <td>{element.stats?.total_points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LiveMatches
