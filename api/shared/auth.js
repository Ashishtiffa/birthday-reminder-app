const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

function verifyToken(req) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        throw new Error('No token provided. Authorization header is missing.');
    }

    // The header is expected to be in the format "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
        throw new Error('Token is missing from the Authorization header.');
    }

    try {
        // Verify the token and return the decoded payload
        const decoded = jwt.verify(token, jwtSecret);
        return decoded.user; // Return the user object from the payload
    } catch (err) {
        // If the token is invalid (e.g., expired, malformed)
        throw new Error('Token is not valid.');
    }
}

module.exports = { verifyToken };
