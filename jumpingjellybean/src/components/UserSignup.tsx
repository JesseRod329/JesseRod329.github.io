import React, { useState } from 'react';
import { User } from '../types';

interface UserSignupProps {
  onSignup: (user: User) => void;
  onLogin: (user: User) => void;
}

const UserSignup: React.FC<UserSignupProps> = ({ onSignup, onLogin }) => {
  const [isSignup, setIsSignup] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.email) {
      setError('Please fill in all fields');
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      username: formData.username,
      email: formData.email,
      createdAt: new Date()
    };

    if (isSignup) {
      onSignup(user);
    } else {
      onLogin(user);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="user-signup">
      <div className="signup-container">
        <div className="signup-header">
          <h2>Welcome to Jumping Jelly Bean!</h2>
          <p>Sign up or log in to track your high scores</p>
        </div>

        <div className="signup-tabs">
          <button 
            className={`tab ${isSignup ? 'active' : ''}`}
            onClick={() => setIsSignup(true)}
          >
            Sign Up
          </button>
          <button 
            className={`tab ${!isSignup ? 'active' : ''}`}
            onClick={() => setIsSignup(false)}
          >
            Log In
          </button>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          {isSignup && (
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                required
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button">
            {isSignup ? 'Sign Up & Play' : 'Log In & Play'}
          </button>
        </form>

        <div className="guest-option">
          <button 
            className="guest-button"
            onClick={() => onLogin({
              id: 'guest',
              username: 'Guest Player',
              email: 'guest@example.com',
              createdAt: new Date()
            })}
          >
            Play as Guest
          </button>
        </div>
      </div>

      <style>{`
        .user-signup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .signup-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 400px;
          color: white;
        }

        .signup-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .signup-header h2 {
          margin: 0 0 0.5rem 0;
          font-size: 1.8rem;
          font-weight: 700;
        }

        .signup-header p {
          margin: 0;
          opacity: 0.8;
          font-size: 0.9rem;
        }

        .signup-tabs {
          display: flex;
          margin-bottom: 2rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 4px;
        }

        .tab {
          flex: 1;
          padding: 0.75rem;
          border: none;
          background: transparent;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .tab.active {
          background: rgba(255, 255, 255, 0.2);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .signup-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 0.5rem;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .form-group input {
          padding: 0.75rem;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .form-group input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .form-group input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.5);
        }

        .error-message {
          color: #ff6b6b;
          font-size: 0.9rem;
          text-align: center;
          margin-top: 0.5rem;
        }

        .submit-button {
          padding: 1rem;
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          border: none;
          border-radius: 10px;
          color: white;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin-top: 1rem;
        }

        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
        }

        .guest-option {
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .guest-button {
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .guest-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default UserSignup;