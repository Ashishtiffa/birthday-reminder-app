const { CosmosClient } = require('@azure/cosmos');
const { verifyToken } = require('../shared/auth');

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = process.env.COSMOS_DB_DATABASE_ID;
const containerId = "birthdays";

module.exports = async function (context, req) {
    context.log('update-birthday function processed a request.');

    try {
        const user = verifyToken(req);
        if (!user) {
            context.res = { status: 401, body: "Unauthorized" };
            return;
        }

        const { id } = context.bindingData;
        const itemBody = req.body;

        if (!itemBody.name || !itemBody.date) {
            context.res = { status: 400, body: "Updated birthday data must include name and date." };
            return;
        }

        const client = new CosmosClient({ endpoint, key });
        const container = client.database(databaseId).container(containerId);

        // To securely update, we should first fetch the item
        const { resource: existingItem } = await container.item(id, user.id).read();

        if (!existingItem) {
            context.res = { status: 404, body: "Birthday not found." };
            return;
        }

        // Verify that the birthday belongs to the authenticated user.
        // This is a redundant check if the partition key is user.id, but it's good practice.
        if (existingItem.userId !== user.id) {
            context.res = { status: 403, body: "Forbidden: You do not have permission to update this birthday." };
            return;
        }

        // Construct the updated item
        const updatedItem = {
            ...existingItem,
            name: itemBody.name,
            date: itemBody.date
        };

        const { resource: replaced } = await container.items.upsert(updatedItem);

        context.res = { status: 200, body: replaced };

    } catch (error) {
        context.log.error(error.message);
        if (error.message.includes("Token")) {
            context.res = { status: 401, body: error.message };
        } else if (error.code === 404) {
            context.res = { status: 404, body: "Birthday not found or you do not have access." };
        } else {
            context.res = { status: 500, body: "An error occurred while updating the birthday." };
        }
    }
};
