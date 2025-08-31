import React, { useState, useEffect } from 'react';
import apiFetch from '../api';
import AddBirthdayForm from './AddBirthdayForm';
import EditBirthdayForm from './EditBirthdayForm'; // We will create this component

const BirthdayPage = ({ user, onLogout }) => {
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null); // To track which birthday is being edited

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const data = await apiFetch('/api/birthdays');
        setBirthdays(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchBirthdays();
  }, [user]);

  const handleBirthdayAdded = (newBirthday) => {
    setBirthdays([...birthdays, newBirthday]);
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/api/birthdays/${id}`, { method: 'DELETE' });
      setBirthdays(birthdays.filter(bday => bday.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = (updatedBirthday) => {
    setBirthdays(birthdays.map(bday => bday.id === updatedBirthday.id ? updatedBirthday : bday));
    setEditingId(null); // Exit editing mode
  };

  return (
    <div className="birthday-page">
      <div className="header">
        <h1>Welcome, {user.username}!</h1>
        <button onClick={onLogout} className="logout-button">Logout</button>
      </div>

      <AddBirthdayForm onBirthdayAdded={handleBirthdayAdded} />

      <h2 style={{ marginTop: '30px' }}>Your Birthday List</h2>

      {loading && <p>Loading birthdays...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <ul className="birthday-list">
          {birthdays.length > 0 ? (
            birthdays.map(bday => (
              <li key={bday.id} className="birthday-item">
                {editingId === bday.id ? (
                  <EditBirthdayForm birthday={bday} onUpdate={handleUpdate} onCancel={() => setEditingId(null)} />
                ) : (
                  <>
                    <span>
                      <strong>{bday.name}</strong> - {new Date(bday.date).toLocaleDateString()}
                    </span>
                    <div>
                      <button onClick={() => setEditingId(bday.id)} className="edit-button">Edit</button>
                      <button onClick={() => handleDelete(bday.id)} className="delete-button">Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))
          ) : (
            <p>You haven't added any birthdays yet.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default BirthdayPage;
