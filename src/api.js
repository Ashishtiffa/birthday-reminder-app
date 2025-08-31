// A wrapper for the fetch API to automatically add the JWT token

const apiFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'An API error occurred.');
    }

    // If response has no content, don't try to parse JSON
    if (response.status === 204) {
        return null;
    }

    return response.json();
};

export default apiFetch;
