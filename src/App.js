import React, { useState } from 'react';
import Login from './components/Login';
import Registration from './components/Registration';
import './components/Form.css';
import './App.css';

function App() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = (form) => {
    setIsLogin(form === 'login');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Birthday Reminder</h1>
        {isLogin ? (
          <Login toggleForm={toggleForm} />
        ) : (
          <Registration toggleForm={toggleForm} />
        )}
      </header>
    </div>
  );
}

export default App;
