const { CosmosClient } = require('@azure/cosmos');
const { verifyToken } = require('../shared/auth');

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = process.env.COSMOS_DB_DATABASE_ID;
const containerId = "birthdays";

module.exports = async function (context, req) {
    context.log('add-birthday function processed a request.');

    try {
        // 1. Verify the token and get the user's ID
        const user = verifyToken(req);
        if (!user) {
            context.res = { status: 401, body: "Unauthorized" };
            return;
        }

        const { name, date } = req.body;

        // 2. Validate input
        if (!name || !date) {
            context.res = { status: 400, body: "Please provide name and date for the birthday." };
            return;
        }

        // 3. Connect to the Database
        const client = new CosmosClient({ endpoint, key });
        const container = client.database(databaseId).container(containerId);

        // 4. Create the new birthday item, using the authenticated user's ID
        const newBirthday = {
            name,
            date,
            userId: user.id
        };

        const { resource: createdItem } = await container.items.create(newBirthday);

        context.res = {
            status: 201,
            body: createdItem
        };

    } catch (error) {
        context.log.error(error.message);
        if (error.message.includes("Token")) {
            context.res = { status: 401, body: error.message };
        } else {
            context.res = { status: 500, body: "An error occurred while adding the birthday." };
        }
    }
};
