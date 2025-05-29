import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MyStatsPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const response = await axios.get('http://localhost:5000/api/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchUser();
  }, [navigate]);

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  };

  if (!user) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Stats</h2>
      <div className="mb-3">
        <strong>Username:</strong> {user.username}<br />
        <strong>Email:</strong> {user.email}<br />
        <strong>Total Score:</strong> {user.totalScore}<br />
        <strong>Matches Played:</strong> {user.matchesPlayed.length}
      </div>

      <h4 className="mt-4">Match History</h4>
      {user.matchesPlayed.length === 0 ? (
        <p className="text-muted">You haven't played any matches yet.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Match</th>
              <th>Date</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {user.matchesPlayed.map((match, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{match.teams}</td>
                <td>{formatDate(match.date)}</td>
                <td>{match.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyStatsPage;
