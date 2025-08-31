const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CosmosClient } = require('@azure/cosmos');

// Get configuration from environment variables
const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = process.env.COSMOS_DB_DATABASE_ID;
const containerId = "users";
const jwtSecret = process.env.JWT_SECRET;

module.exports = async function (context, req) {
    context.log('Login function processed a request.');

    if (!jwtSecret) {
        context.res = { status: 500, body: "JWT secret is not configured." };
        return;
    }

    const { username, password } = req.body;

    if (!username || !password) {
        context.res = { status: 400, body: "Please provide both a username and a password." };
        return;
    }

    try {
        const client = new CosmosClient({ endpoint, key });
        const container = client.database(databaseId).container(containerId);

        const { resources: users } = await container.items
            .query({
                query: "SELECT * from c WHERE c.username = @username",
                parameters: [{ name: "@username", value: username.toLowerCase() }]
            })
            .fetchAll();

        if (users.length === 0) {
            context.res = { status: 401, body: "Invalid credentials." };
            return;
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            context.res = { status: 401, body: "Invalid credentials." };
            return;
        }

        // Create JWT Payload
        const payload = {
            user: {
                id: user.id,
                username: user.username
            }
        };

        // Sign the token
        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: '1d' }, // Token expires in 1 day
            (err, token) => {
                if (err) throw err;
                context.res = {
                    status: 200,
                    body: { token }
                };
                context.done();
            }
        );

    } catch (error) {
        context.log.error(error);
        context.res = { status: 500, body: "An error occurred during the login process." };
    }
};
