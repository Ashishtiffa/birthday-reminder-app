import React, { useState } from 'react';
import apiFetch from '../api';

const EditBirthdayForm = ({ birthday, onUpdate, onCancel }) => {
    const [name, setName] = useState(birthday.name);
    // The date from the DB needs to be formatted as yyyy-MM-dd for the input field
    const [date, setDate] = useState(new Date(birthday.date).toISOString().split('T')[0]);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const updatedBirthday = await apiFetch(`/api/birthdays/${birthday.id}`, {
                method: 'PUT',
                body: JSON.stringify({ name, date, userId: birthday.userId }), // userId is required by the backend logic
            });
            onUpdate(updatedBirthday);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="edit-birthday-form">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
            {error && <p className="error-message" style={{ fontSize: '12px', margin: '5px 0 0 0' }}>{error}</p>}
        </form>
    );
};

export default EditBirthdayForm;
