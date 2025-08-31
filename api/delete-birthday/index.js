const { CosmosClient } = require('@azure/cosmos');
const { verifyToken } = require('../shared/auth');

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = process.env.COSMOS_DB_DATABASE_ID;
const containerId = "birthdays";

module.exports = async function (context, req) {
    context.log('delete-birthday function processed a request.');

    try {
        const user = verifyToken(req);
        if (!user) {
            context.res = { status: 401, body: "Unauthorized" };
            return;
        }

        const { id } = context.bindingData;

        const client = new CosmosClient({ endpoint, key });
        const container = client.database(databaseId).container(containerId);

        // To delete an item, you need its id and its partition key.
        // We are using the authenticated user's ID as the partition key.
        // This inherently prevents a user from deleting another user's data.
        await container.item(id, user.id).delete();

        context.res = {
            status: 204 // No Content
        };

    } catch (error) {
        context.log.error(error.message);
        if (error.message.includes("Token")) {
            context.res = { status: 401, body: error.message };
        } else if (error.code === 404) {
            context.res = { status: 404, body: "Birthday not found or you do not have access." };
        } else {
            context.res = { status: 500, body: "An error occurred while deleting the birthday." };
        }
    }
};
