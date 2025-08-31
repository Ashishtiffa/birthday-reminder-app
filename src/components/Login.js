import React from 'react';

const Login = ({ toggleForm }) => {
  return (
    <div className="form-container">
      <h2>Login</h2>
      <form>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{' '}
        <span className="toggle-link" onClick={() => toggleForm('register')}>
          Register here
        </span>
      </p>
    </div>
  );
};

export default Login;
