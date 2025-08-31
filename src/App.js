import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Registration from './components/Registration';
import BirthdayPage from './components/BirthdayPage';
import './components/Form.css';
import './App.css';

// Helper function to decode JWT payload
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

function App() {
  const [user, setUser] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);

  // Check for existing token on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userPayload = parseJwt(token);
      // You might want to add a check here to see if the token is expired
      if (userPayload) {
        setUser(userPayload.user);
      }
    }
  }, []);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Birthday Reminder</h1>
        {user ? (
          <BirthdayPage user={user} onLogout={handleLogout} />
        ) : (
          isLoginView ? (
            <Login toggleForm={toggleView} onLoginSuccess={handleLoginSuccess} />
          ) : (
            <Registration toggleForm={toggleView} onLoginSuccess={handleLoginSuccess} />
          )
        )}
      </header>
    </div>
  );
}

export default App;
