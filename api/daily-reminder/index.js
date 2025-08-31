const { CosmosClient } = require('@azure/cosmos');
const axios = require('axios');

// Configuration
const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = process.env.COSMOS_DB_DATABASE_ID;
const birthdaysContainerId = "birthdays";
const brevoApiKey = process.env.BREVO_API_KEY;
const senderEmail = process.env.BREVO_SENDER_EMAIL;
const recipientEmail = process.env.REMINDER_EMAIL_RECIPIENT;
const brevoApiUrl = 'https://api.brevo.com/v3/smtp/email';

// Helper to check if a date's month and day match another date's
const isSameMonthDay = (date1, date2) => {
    return date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
};

module.exports = async function (context, myTimer) {
    const timeStamp = new Date().toISOString();
    context.log('Daily reminder function ran!', timeStamp);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    try {
        const client = new CosmosClient({ endpoint, key });
        const container = client.database(databaseId).container(birthdaysContainerId);

        // 1. Fetch all birthdays from the database
        const { resources: allBirthdays } = await container.items.readAll().fetchAll();

        if (!allBirthdays || allBirthdays.length === 0) {
            context.log("No birthdays found in the database.");
            return;
        }

        // 2. Filter birthdays in code to find ones happening tomorrow
        const upcomingBirthdays = allBirthdays.filter(birthday => {
            const birthdayDate = new Date(birthday.date);
            return isSameMonthDay(birthdayDate, tomorrow);
        });

        if (upcomingBirthdays.length === 0) {
            context.log("No birthdays tomorrow. All quiet.");
            return;
        }

        context.log(`Found ${upcomingBirthdays.length} birthday(s) for tomorrow.`);

        // 3. Send an email for each upcoming birthday
        for (const birthday of upcomingBirthdays) {
            const emailSubject = `🎉 Birthday Reminder: ${birthday.name}'s birthday is tomorrow!`;
            const emailContent = `<h1>Don't forget!</h1><p>Just a friendly reminder that <strong>${birthday.name}</strong>'s birthday is tomorrow, ${tomorrow.toLocaleDateString()}.</p>`;

            const emailData = {
                sender: { email: senderEmail },
                to: [{ email: recipientEmail }],
                subject: emailSubject,
                htmlContent: emailContent,
            };

            const headers = { 'api-key': brevoApiKey, 'content-type': 'application/json' };

            await axios.post(brevoApiUrl, emailData, { headers });
            context.log(`Successfully sent reminder for ${birthday.name} to ${recipientEmail}.`);
        }

    } catch (error) {
        context.log.error("An error occurred during the daily reminder process.");
        if (error.response) {
            context.log.error('Error response data:', error.response.data);
        } else {
            context.log.error('Error message:', error.message);
        }
    }
};
