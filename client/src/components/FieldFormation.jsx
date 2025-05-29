import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import PlayerModal from './PlayerModal';
import fieldImage from '../assets/field.png';

const FORMATION_SPOTS = [
  { id: 'GK', label: 'GK', top: '85%', left: '50%' },
  { id: 'LB', label: 'LB', top: '70%', left: '20%' },
  { id: 'CB1', label: 'CB', top: '75%', left: '40%' },
  { id: 'CB2', label: 'CB', top: '75%', left: '60%' },
  { id: 'RB', label: 'RB', top: '70%', left: '80%' },
  { id: 'CM1', label: 'CM', top: '55%', left: '35%' },
  { id: 'CM2', label: 'CM', top: '55%', left: '65%' },
  { id: 'CM3', label: 'CM', top: '45%', left: '50%' },
  { id: 'LW', label: 'LW', top: '25%', left: '20%' },
  { id: 'ST', label: 'ST', top: '20%', left: '50%' },
  { id: 'RW', label: 'RW', top: '25%', left: '80%' },
];

function FieldFormation() {
  const { fixtureId } = useParams();
  const navigate = useNavigate();

  const [modalSpot, setModalSpot] = useState(null);
  const [selectedPlayers, setSelectedPlayers] = useState({});
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLineups = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/lineups', { params: { fixture: fixtureId } });
        let fetchedPlayers = [];
        response.data.response.forEach(teamObj => {
          if (teamObj.players) {
            fetchedPlayers = fetchedPlayers.concat(teamObj.players.map(item => item.player));
          }
        });
        setPlayers(fetchedPlayers);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    if (fixtureId) fetchLineups();
  }, [fixtureId]);

  const handleSpotClick = spotId => setModalSpot(spotId);

  const handlePlayerSelect = player => {
    if (!modalSpot) return;
    setSelectedPlayers(prev => ({ ...prev, [modalSpot]: player }));
    setModalSpot(null);
  };

  const handleCloseModal = () => setModalSpot(null);

  const filteredPlayers = players.filter(player => {
    const selectedIds = Object.entries(selectedPlayers)
      .filter(([spot]) => spot !== modalSpot)
      .map(([_, selPlayer]) => selPlayer.id);
    const currentSelection = modalSpot ? selectedPlayers[modalSpot]?.id : null;
    return !selectedIds.includes(player.id) || player.id === currentSelection;
  });

  const allSpotsFilled = FORMATION_SPOTS.every(spot => selectedPlayers[spot.id]);

  const playMatch = async () => {
    if (!allSpotsFilled) {
      alert('Please select all players before playing the match.');
      return;
    }

    const teamData = FORMATION_SPOTS.map(spot => ({
      spot: spot.id,
      playerId: selectedPlayers[spot.id].id,
      playerName: selectedPlayers[spot.id].name,
    }));

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/play-match',
        { fixtureId, teamData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Your score for this match is: ${response.data.matchScore}`);
      navigate('/leaderboard');
    } catch (error) {
      console.error('Error playing match:', error);
      alert('There was an error calculating your score. Please try again.');
    }
  };

  if (loading) return <div className="container mt-4">Loading match players...</div>;
  if (error) return <div className="container mt-4 text-danger">Error: {error.message}</div>;

  return (
    <div style={{ position: 'relative', width: '800px', margin: '0 auto' }}>
      <img src={fieldImage} alt="Football Field" style={{ width: '100%' }} />
      {FORMATION_SPOTS.map(spot => (
        <div
          key={spot.id}
          style={{ position: 'absolute', top: spot.top, left: spot.left, transform: 'translate(-50%, -50%)' }}
        >
          <button
            onClick={() => handleSpotClick(spot.id)}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: '2px solid #ccc',
              backgroundColor: '#eee',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {selectedPlayers[spot.id] ? (
              <>
                <img
                  src={selectedPlayers[spot.id].photo}
                  alt={selectedPlayers[spot.id].name}
                  style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                />
                <span style={{ fontSize: '10px' }}>{selectedPlayers[spot.id].name}</span>
              </>
            ) : (
              <strong>{spot.label}</strong>
            )}
          </button>
        </div>
      ))}

      {modalSpot && (
        <PlayerModal
          players={filteredPlayers}
          onSelect={handlePlayerSelect}
          onClose={handleCloseModal}
        />
      )}

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          disabled={!allSpotsFilled}
          onClick={playMatch}
          style={{
            padding: '10px 20px',
            backgroundColor: allSpotsFilled ? '#28a745' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: allSpotsFilled ? 'pointer' : 'not-allowed',
          }}
        >
          Play Match
        </button>
      </div>
    </div>
  );
}

export default FieldFormation;
