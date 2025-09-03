import React, { useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const [data, setData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { loginUser } = useContext(AuthContext);
  const nav = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    // client-side confirm password check (helpful UX)
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // ensure email sent lowercase for consistency (backend also lowercases)
      const payload = { ...data, email: (data.email || '').toLowerCase() };

      const res = await API.post('/users/register', payload);
      loginUser(res.data.token, res.data.status);
      nav('/verify-pin');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>

        {error && <p className="error">{error}</p>}

        {['name', 'email', 'phone', 'country'].map(f => (
          <div key={f}>
            <label>{f.charAt(0).toUpperCase() + f.slice(1)}</label>
            <input
              type={f === 'email' ? 'email' : 'text'}
              value={data[f]}
              onChange={e => setData({ ...data, [f]: e.target.value })}
              required
            />
          </div>
        ))}

        <div>
          <label>Password</label>
          <input
            type="password"
            value={data.password}
            onChange={e => setData({ ...data, password: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            value={data.confirmPassword}
            onChange={e => setData({ ...data, confirmPassword: e.target.value })}
            required
          />
        </div>

        <button type="submit">Register</button>
        <p>Already have account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
