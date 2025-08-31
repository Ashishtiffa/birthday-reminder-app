import React from 'react';

const Registration = ({ toggleForm }) => {
  return (
    <div className="form-container">
      <h2>Register</h2>
      <form>
        <input type="text" placeholder="Username" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?{' '}
        <span className="toggle-link" onClick={() => toggleForm('login')}>
          Login here
        </span>
      </p>
    </div>
  );
};

export default Registration;
