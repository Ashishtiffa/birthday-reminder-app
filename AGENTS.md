# Hello! I'm Jules, your AI Software Engineer!

Welcome to the Birthday Reminder App project! My job is to help you build this app. This file is our special instruction manual. I'll keep it updated and explain everything we do in simple terms, so it's easy to follow along.

---

## What Are We Building?

Imagine you have a magic notebook that not only remembers all your friends' birthdays but also sends you a little reminder message so you never forget. That's what we're building! It will be a website (a "web app") where you can:
1.  **Log in** safely so only you can see your list.
2.  **Add** new birthdays with your friends' names and dates.
3.  **See** a list of all the upcoming birthdays.
4.  Get an **email reminder** before a birthday happens.

---

## How It Works: The Two Big Parts

Our app has two main parts that work together, like a team.

### 1. The Frontend (The part you see and click)
*   **What it is:** This is the part of the app that you see in your web browser. It's all the buttons, forms, and lists that you can interact with.
*   **How it's built:** We're using a tool called **React**. React is like a box of LEGOs for building websites. It lets us create reusable pieces (we call them "components") to build the user interface.

### 2. The Backend (The "brains" of the app)
*   **What it is:** This is the part that works behind the scenes. You don't see it, but it does all the important work, like:
    *   Checking your password when you log in.
    *   Saving the birthday information you enter.
    *   Figuring out when to send a reminder email.
*   **How it's built:** We will use **Azure Functions**. Think of this as a helper robot that runs on a giant computer in the cloud (at Microsoft Azure). Our frontend will send messages to this robot to tell it what to do (like "save this birthday!").

---

## What You Need Before We Start (Prerequisites)

To work on this project and run it on your computer, you'll need a few things. Here’s a list with simple explanations.

### 1. Node.js and npm
*   **What they are:**
    *   **Node.js:** It's a magic tool that lets us run our JavaScript code (the language of the web) on our computer, not just in a browser.
    *   **npm (Node Package Manager):** Think of this as a giant, free online store for code. If we need a special tool, like a calendar, we can get it from npm.
*   **How to check if you have them:**
    *   Open your computer's command line or terminal.
    *   Type `node -v` and press Enter. If you see a version number (like `v18.12.1`), you have Node.js!
    *   Type `npm -v` and press Enter. If you see a version number (like `9.8.1`), you have npm!
    *   If you don't have them, you can download them together from the official [Node.js website](https://nodejs.org/).

### 2. A Code Editor
*   **What it is:** A special program for writing code. It's like Microsoft Word, but for programming. It helps you by color-coding your code and pointing out simple mistakes.
*   **Recommendation:** We recommend using **Visual Studio Code (VS Code)**. It's free and very popular! You can download it from the [VS Code website](https://code.visualstudio.com/).

### 3. A Web Browser
*   You already have this! It's what you use to surf the internet, like Google Chrome, Firefox, or Microsoft Edge.

### 4. Accounts for Cloud Services (Free ones!)
*   **Azure Account:** We need an account with Microsoft Azure. This is where our app will "live" on the internet. They have a free plan that gives us everything we need for this project. You can sign up here: [Azure Free Account](https://azure.microsoft.com/en-us/free/).
*   **Sendinblue (now called Brevo) Account:** This is the service that will send the reminder emails for us. They also have a free plan that lets you send hundreds of emails a day, which is more than enough for us. You can sign up here: [Brevo Website](https://www.brevo.com/).

---

## Important: Setting Up Your Local Secrets (`local.settings.json`)

Before you can run the backend server, you need to provide it with all the necessary secret keys and connection strings. I have created a file for you at `api/local.settings.json`.

You **must** open this file and fill in the placeholder values (e.g., `"YOUR_COSMOS_DB_ENDPOINT_HERE"`) with your actual secrets from your Azure and Brevo accounts.

One special setting is `AzureWebJobsStorage`. I have set it to `UseDevelopmentStorage=true`, which allows you to run the backend locally without needing a real Azure Storage account. You can leave this as is.

This `local.settings.json` file is for your computer only and is ignored by git, so your secrets will not be uploaded.

---

## How to Run the App on Your Computer (Full Stack)

Now that we have both a frontend and a backend, running the app on your computer requires two steps. Think of it like starting the engine (the backend) and then turning on the dashboard (the frontend). You'll need two separate terminals for this.

### 1. Before you start: Install all dependencies
First, make sure you have all the code "packages" for both the frontend and backend.
*   In your main terminal, run: `npm install` (this installs the frontend packages).
*   Then, navigate into the api folder and do the same: `cd api && npm install` (this installs the backend packages).

### 2. Start the Backend Server (The Brains)
*   In your first terminal, navigate to the `api` directory.
*   Run the command: `func start`
*   This will start up all our "helper robots" (the Azure Functions). You should see a list of available API endpoints, like `http://localhost:7071/api/login`. Keep this terminal running.

### 3. Start the Frontend Server (The Part You See)
*   Open a **second, new terminal**.
*   In this new terminal (which should be at the project root), run the command: `npm start`
*   This will start the React development server and automatically open the app in your web browser at `http://localhost:3000`.

Now, when you use the web app, the frontend will automatically "proxy" its API calls to your running backend server. Everything should be fully connected and working!

---

## Our Next Steps

As we discussed, the login and registration forms are just the visual part. They don't *do* anything yet. Our next big adventure will be to build the **Backend** (the brains) so that we can:
*   Actually register new users.
*   Let users log in securely.
*   Start saving birthdays!

I will guide you through every step of this process. Let's get building!

---

## Our Plan for Building the Backend (The Brains)

Okay, it's time to build the most important part of our app: the backend! This is where all the magic happens. We're going to build a team of helper "robots" (which are really Azure Functions) that will do all the heavy lifting for us. Here is our step-by-step plan, explained simply.

### Step 1: Build the 'User Manager' Robots
First, we need robots that can handle who is allowed to use the app.

*   **The 'Sign-Up' Robot:** We'll build a robot that lets a new person sign up. When you enter a username and password, this robot will take the password, scramble it into a secret code (this is called "hashing" and it's super secure!), and then store the username and secret code in our online filing cabinet (Cosmos DB).
*   **The 'Doorman' Robot:** This robot is like a doorman at a private club. When you try to log in, you'll give it your username and password. The robot will take the password, turn it into the same secret code, and then check the filing cabinet to see if it matches the code we have stored. If it matches, the doorman lets you in!

### Step 2: Build the 'Birthday Keeper' Robots
Next, we need robots that can remember and manage all the birthdays.

*   This will be a team of four robots that work together:
    1.  **The 'Add' Robot:** When you add a new birthday, this robot will take the name and date and file it away neatly in our online filing cabinet.
    2.  **The 'Show' Robot:** When you want to see your list of birthdays, this robot will go to the filing cabinet and grab the whole list for you.
    3.  **The 'Update' Robot:** If you make a mistake (like typing the wrong date), this robot will let you fix it and will update the information in the filing cabinet.
    4.  **The 'Delete' Robot:** If you want to remove a birthday, this robot will find it in the filing cabinet and shred it for you.

### Step 3: Build the 'Reminder' Robot
This is the most special robot of all!

*   **The 'Alarm Clock' Robot:** This robot is like an alarm clock that we will set to go off once every single day.
*   When it wakes up, its only job is to look through the entire birthday list in the filing cabinet. It will check if any birthdays are coming up that need a reminder (e.g., happening tomorrow).
*   If it finds one, it will immediately tell our email service (Brevo) to send you a nice reminder email.

### Step 4: Connect Everything Together
Once all our helper robots are built and ready, the final step is to connect them to the frontend (the part of the app you see). We'll update the forms and buttons so that when you click "Login" or "Add Birthday", they know how to send a message to the correct robot to get the job done.

And that's it! Once these four steps are done, our app will be fully working. I will let you know as I complete each part of this plan.
