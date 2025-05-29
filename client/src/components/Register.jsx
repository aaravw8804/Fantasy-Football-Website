import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    dob: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Simple email regex
  const isValidEmail = email =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Calculate age from YYYY-MM-DD
  const calculateAge = dobStr => {
    const today = new Date();
    const dob = new Date(dobStr);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  // Determine overall form validity
  const isFormValid = useMemo(() => {
    const { name, username, dob, email, password } = formData;
    if (
      !name.trim() ||
      !username.trim() ||
      !dob ||
      !email.trim() ||
      !password.trim()
    ) {
      return false;
    }
    if (!isValidEmail(email)) {
      return false;
    }
    if (calculateAge(dob) < 18) {
      return false;
    }
    return true;
  }, [formData]);

  const onSubmit = async e => {
    e.preventDefault();
    if (!isFormValid) return; // just in case

    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/register',
        formData
      );
      localStorage.setItem('token', res.data.token);
      alert('Registration successful! Welcome aboard.');
      navigate('/');
    } catch (error) {
      const msg =
        error.response?.data?.msg ||
        'Registration failed due to a server error.';
      console.error('Registration error:', msg);
      alert(msg);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', paddingTop: '30px' }}>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            className="form-control"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="mb-3">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={onChange}
            className="form-control"
            placeholder="Choose a username"
            required
          />
        </div>

        <div className="mb-3">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={onChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className="form-control"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            className="form-control"
            placeholder="Choose a password"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={!isFormValid}
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
