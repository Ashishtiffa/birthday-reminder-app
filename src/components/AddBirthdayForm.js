import React, { useState } from 'react';
import apiFetch from '../api';

const AddBirthdayForm = ({ onBirthdayAdded }) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name || !date) {
            setError('Please fill out all fields.');
            return;
        }

        try {
            const newBirthday = await apiFetch('/api/birthdays', {
                method: 'POST',
                body: JSON.stringify({ name, date }),
            });
            // Call the callback to update the parent component's state
            onBirthdayAdded(newBirthday);
            // Clear the form
            setName('');
            setDate('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="add-birthday-form">
            <h3>Add a New Birthday</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <button type="submit">Add</button>
                </div>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default AddBirthdayForm;
