import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MonthlyFixturesTab() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupedFixtures, setGroupedFixtures] = useState({});
  const [monthKeys, setMonthKeys] = useState([]);
  const [activeMonth, setActiveMonth] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/fixtures');
        const fetchedFixtures = response.data.response;

        const grouped = {};
        fetchedFixtures.forEach((fixture) => {
          const dateStr = fixture?.fixture?.date;
          if (dateStr) {
            const dateObj = new Date(dateStr);
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const key = `${year}-${month}`;
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(fixture);
          }
        });

        const sortedKeys = Object.keys(grouped).sort();
        setGroupedFixtures(grouped);
        setMonthKeys(sortedKeys);

        const currentMonthKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
        if (grouped[currentMonthKey]) {
          setActiveMonth(currentMonthKey);
        } else {
          setActiveMonth(sortedKeys[0]);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching fixtures:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabClick = (monthKey) => {
    setActiveMonth(monthKey);
  };

  const formatMonthLabel = (monthKey) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Modified Participate: Check for a token before navigating.
  const handleParticipateClick = (fixtureId) => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate(`/formation/${fixtureId}`);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const activeMonthFixtures = groupedFixtures[activeMonth] || [];

  if (loading) return <div className="container mt-4">Loading fixtures...</div>;
  if (error) return <div className="container mt-4 text-danger">Error: {error.message}</div>;

  return (
    <div className="container mt-4">
      <h1>Premier League Fixtures</h1>
      {/* Month Tabs */}
      <ul className="nav nav-tabs mb-4">
        {monthKeys.map((monthKey) => (
          <li key={monthKey} className="nav-item">
            <button
              className={`nav-link ${activeMonth === monthKey ? 'active' : ''}`}
              onClick={() => handleTabClick(monthKey)}
              style={{ cursor: 'pointer' }}
            >
              {formatMonthLabel(monthKey)}
            </button>
          </li>
        ))}
      </ul>
      {/* Fixtures List */}
      {activeMonthFixtures.length === 0 ? (
        <p>No matches scheduled</p>
      ) : (
        activeMonthFixtures.map((fixture, index) => {
          const dateObj = new Date(fixture.fixture.date);
          const dayString = dateObj.toDateString();
          const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const homeTeam = fixture.teams.home;
          const awayTeam = fixture.teams.away;
          const venue = fixture.fixture.venue.name;
          return (
            <div key={index} className="card p-3 mb-3 shadow-sm">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <img
                    src={homeTeam.logo}
                    alt={homeTeam.name}
                    style={{ width: '30px', height: '30px', marginRight: '10px' }}
                  />
                  <strong>{homeTeam.name}</strong>
                </div>
                <div className="fw-bold">vs</div>
                <div className="d-flex align-items-center">
                  <img
                    src={awayTeam.logo}
                    alt={awayTeam.name}
                    style={{ width: '30px', height: '30px', marginRight: '10px' }}
                  />
                  <strong>{awayTeam.name}</strong>
                </div>
              </div>
              <div className="mt-2 text-muted small">
                {dayString} at {timeString} — <strong>{venue}</strong>
              </div>
              <button
                className="btn btn-outline-success btn-sm mt-2"
                onClick={() => handleParticipateClick(fixture.fixture.id)}
              >
                Participate
              </button>
            </div>
          );
        })
      )}

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              maxWidth: '90%',
            }}
          >
            <p>Please log in to participate in the game.</p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowLoginPrompt(false);
                // Optionally, navigate to home so the user can trigger the login popup
                navigate('/');
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MonthlyFixturesTab;
