const { CosmosClient } = require('@azure/cosmos');
const { verifyToken } = require('../shared/auth');

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = process.env.COSMOS_DB_DATABASE_ID;
const containerId = "birthdays";

module.exports = async function (context, req) {
    context.log('get-birthdays function processed a request.');

    try {
        const user = verifyToken(req);
        if (!user) {
            context.res = { status: 401, body: "Unauthorized" };
            return;
        }

        const client = new CosmosClient({ endpoint, key });
        const container = client.database(databaseId).container(containerId);

        // Query for birthdays belonging to the authenticated user
        const { resources: items } = await container.items
            .query({
                query: "SELECT * from c WHERE c.userId = @userId",
                parameters: [{ name: "@userId", value: user.id }]
            })
            .fetchAll();

        context.res = {
            status: 200,
            body: items
        };

    } catch (error) {
        context.log.error(error.message);
        if (error.message.includes("Token")) {
            context.res = { status: 401, body: error.message };
        } else {
            context.res = { status: 500, body: "An error occurred while fetching birthdays." };
        }
    }
};
