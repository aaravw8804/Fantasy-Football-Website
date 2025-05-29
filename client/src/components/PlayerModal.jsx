// PlayerModal.jsx
import React from 'react';

function PlayerModal({ players, onSelect, onClose }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '300px',
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          maxHeight: '70vh',
          overflowY: 'auto',
        }}
      >
        <h3>Select a Player</h3>
        <button onClick={onClose} style={{ float: 'right', marginBottom: '10px' }}>
          X
        </button>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {players.map((player) => (
            <li
              key={player.id}
              style={{
                margin: '10px 0',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              onClick={() => onSelect(player)}
            >
              <img
                src={player.photo}
                alt={player.name}
                style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }}
              />
              <span>{player.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PlayerModal;
