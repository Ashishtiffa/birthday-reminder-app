const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CosmosClient } = require('@azure/cosmos');

// Get configuration from environment variables
const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = process.env.COSMOS_DB_DATABASE_ID;
const containerId = "users";
const jwtSecret = process.env.JWT_SECRET;

const validateInput = (username, password) => {
    if (!username || !password) return "Please provide both a username and a password.";
    if (password.length < 6) return "Password must be at least 6 characters long.";
    return null;
};

module.exports = async function (context, req) {
    context.log('Register function processed a request.');

    if (!jwtSecret) {
        context.res = { status: 500, body: "JWT secret is not configured." };
        return;
    }

    const { username, password } = req.body;

    const validationError = validateInput(username, password);
    if (validationError) {
        context.res = { status: 400, body: validationError };
        return;
    }

    try {
        const client = new CosmosClient({ endpoint, key });
        const container = client.database(databaseId).container(containerId);

        const { resources: existingUsers } = await container.items
            .query({
                query: "SELECT * from c WHERE c.username = @username",
                parameters: [{ name: "@username", value: username.toLowerCase() }]
            })
            .fetchAll();

        if (existingUsers.length > 0) {
            context.res = { status: 409, body: "User with this username already exists." };
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username: username.toLowerCase(),
            password: hashedPassword
        };

        const { resource: createdUser } = await container.items.create(newUser);

        // Create JWT Payload
        const payload = {
            user: {
                id: createdUser.id,
                username: createdUser.username
            }
        };

        // Sign the token
        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                context.res = {
                    status: 201, // Created
                    body: { token }
                };
                context.done();
            }
        );

    } catch (error) {
        context.log.error(error);
        context.res = { status: 500, body: "An error occurred while registering the user." };
    }
};
