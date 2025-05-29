import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';
import avatarIcon from '../assets/avatar.svg'; // Add your avatar image here

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '',
    dob: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', loginData);
      const token = res.data.token;
      localStorage.setItem('token', token);

      const profileRes = await axios.get('http://localhost:5000/api/me', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setUserData(profileRes.data);

      setIsLoggedIn(true);
      setShowLogin(false);
      setLoginData({ email: '', password: '' });
    } catch (error) {
      console.error('Login error:', error.response?.data?.msg || error.message);
      alert(error.response?.data?.msg || 'Login failed. Please check your credentials.');
    }
  };

  const handleSignUp = async () => {
    if (signupData.password !== signupData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name: signupData.name,
        dob: signupData.dob,
        username: signupData.username,
        email: signupData.email,
        password: signupData.password,
      });
      localStorage.setItem('token', res.data.token);
      alert('Registration successful! Please log in.');
      setShowSignIn(false);
      setShowLogin(true);
    } catch (error) {
      console.error('Registration error:', error.response?.data?.msg || error.message);
      alert(error.response?.data?.msg || 'Registration failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserData({});
    setShowProfile(false);
    navigate('/');
  };

  const linkStyle = { textDecoration: 'none', color: 'inherit' };
  const popupStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <Link to="/" style={linkStyle}>🏆 Galaxy League</Link>
        </div>
        <ul className="nav-links">
          <li><Link to="/fixtures" style={linkStyle}>Fixtures</Link></li>
          <li><Link to="/rules" style={linkStyle}>Rules</Link></li>
          <li><Link to="/leaderboard" style={linkStyle}>Leaderboard</Link></li>
        </ul>
        {isLoggedIn ? (
          <div className="profile-icon" onClick={() => setShowProfile(true)}>
            <img src={avatarIcon} alt="avatar" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
          </div>
        ) : (
          <button className="login-btn" onClick={() => setShowLogin(true)}>Login</button>
        )}
      </nav>

      {showLogin && (
        <div className="popup" style={popupStyle}>
          <div className="popup-content">
            <span className="close" onClick={() => setShowLogin(false)}>&times;</span>
            <h2>Login</h2>
            <input type="email" placeholder="Enter your email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
            <input type="password" placeholder="Enter your password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
            <button className="popup-btn" onClick={handleLogin}>Login</button>
            <p onClick={() => { setShowLogin(false); setShowSignIn(true); }} className="switch">Not registered? <span>Sign Up</span></p>
          </div>
        </div>
      )}

      {showSignIn && (
        <div className="popup" style={popupStyle}>
          <div className="popup-content">
            <span className="close" onClick={() => setShowSignIn(false)}>&times;</span>
            <h2>Sign Up</h2>
            <input type="text" placeholder="Enter your full name" value={signupData.name} onChange={(e) => setSignupData({ ...signupData, name: e.target.value })} />
            <input type="date" placeholder="Date of Birth" value={signupData.dob} onChange={(e) => setSignupData({ ...signupData, dob: e.target.value })} />
            <input type="text" placeholder="Enter your username" value={signupData.username} onChange={(e) => setSignupData({ ...signupData, username: e.target.value })} />
            <input type="email" placeholder="Enter your email" value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} />
            <input type="password" placeholder="Enter your password" value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} />
            <input type="password" placeholder="Confirm password" value={signupData.confirmPassword} onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })} />
            <button className="popup-btn" onClick={handleSignUp}>Sign Up</button>
          </div>
        </div>
      )}

      <div className={`profile-panel ${showProfile ? 'open' : ''}`}>
        <div className="profile-content">
          <span className="close-profile" onClick={() => setShowProfile(false)}>&times;</span>
          <h2>My Profile</h2>
          <p><strong>Name:</strong> {userData.name || 'N/A'}</p>
          <p><strong>Email:</strong> {userData.email || 'N/A'}</p>
          <p><strong>Date of Birth:</strong> {userData.dob ? new Date(userData.dob).toLocaleDateString() : 'N/A'}</p>
          <Link to="/my-stats" className="popup-btn" onClick={() => setShowProfile(false)}>View Full Stats</Link>
          <button className="popup-btn" onClick={handleLogout} style={{ marginTop: '20px' }}>Logout</button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
