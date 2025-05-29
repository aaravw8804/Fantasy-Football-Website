import React, { useState, useEffect } from 'react';

const MatchDetails = ({ fixtureId, apiKey }) => {
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        const response = await fetch(
          `https://api-football-v1.p.rapidapi.com/v3/fixtures?id=${fixtureId}`,
          {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': apiKey,
              'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
            },
          }
        );
        const jsonData = await response.json();
        if (jsonData.response && jsonData.response.length > 0) {
          setMatchData(jsonData.response[0]);
        } else {
          setError('No match data found.');
        }
      } catch (err) {
        setError('Error fetching match details.');
      }
      setLoading(false);
    };

    fetchMatchData();
  }, [fixtureId, apiKey]);

  if (loading) {
    return <div>Loading match details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Process match events to extract goals and assists
  const events = matchData.events || [];
  const goals = {};
  const assists = {};

  events.forEach(event => {
    const eventType = event.type;
    const playerName = event.player?.name;
    if (eventType === 'Goal') {
      goals[playerName] = (goals[playerName] || 0) + 1;
    } else if (eventType === 'Assist') {
      assists[playerName] = (assists[playerName] || 0) + 1;
    }
  });

  return (
    <div>
      <h2>Match Details</h2>
      <h3>Goals Scored:</h3>
      <ul>
        {Object.entries(goals).map(([player, count]) => (
          <li key={player}>
            {player}: {count}
          </li>
        ))}
      </ul>
      <h3>Assists:</h3>
      <ul>
        {Object.entries(assists).map(([player, count]) => (
          <li key={player}>
            {player}: {count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchDetails;
