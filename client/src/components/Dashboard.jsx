import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/teams');
        setTeams(res.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    const fetchPlayers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/players');
        setPlayers(res.data);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    fetchTeams();
    fetchPlayers();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <h3>Teams</h3>
      <ul>
        {teams.map(team => (
          <li key={team._id}>
            {team.name} - Owner: {team.owner?.username || 'N/A'}
          </li>
        ))}
      </ul>
      <h3>Players</h3>
      <ul>
        {players.map(player => (
          <li key={player._id}>
            {player.name} - {player.position} - {player.team} - ${player.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
