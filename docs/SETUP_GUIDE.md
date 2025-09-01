# Windows Local Setup Guide for Birthday Reminder App

This guide provides detailed, step-by-step instructions to set up and run the Birthday Reminder application on your Windows laptop.

**Your chosen local folder:** `C:\Users\Public\Github`

---

## Part 1: Prerequisites Installation & Verification

These are the tools you need to install on your computer before you can run the project. We will use PowerShell in **Administrator mode** for all installations to ensure they have the correct permissions.

### 1. Git (Source Code Management)

*   **What it is:** Git is the tool we use to download the project code from GitHub and manage its versions.
*   **How to Install:**
    1.  Open PowerShell **as Administrator**. (Search for PowerShell, right-click, and choose "Run as administrator").
    2.  Install it using the Chocolatey package manager. If you don't have Chocolatey, it will be installed first. Run this command:
        ```powershell
        Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1')); choco install git -y
        ```
*   **How to Verify:**
    *   **Folder:** `C:\Users\Public\Github` (or any folder)
    *   **Mode:** Normal PowerShell
    *   Run this command:
        ```powershell
        git --version
        ```
    *   You should see a version number like `git version 2.37.2.windows.1`.

### 2. Node.js and npm (JavaScript Environment)

*   **What they are:** Node.js lets us run JavaScript code, and `npm` lets us manage the project's libraries (dependencies).
*   **How to Install:**
    1.  Open PowerShell **as Administrator**.
    2.  Run this command to install the Long-Term Support (LTS) version:
        ```powershell
        choco install nodejs-lts -y
        ```
*   **How to Verify:**
    *   **Folder:** `C:\Users\Public\Github` (or any folder)
    *   **Mode:** Normal PowerShell
    *   Run these two commands separately:
        ```powershell
        node -v
        npm -v
        ```
    *   You should see version numbers, for example `v18.17.1` and `9.6.7`.

### 3. Azure Functions Core Tools (Backend Server)

*   **What it is:** This is the tool that lets us run the backend Azure Functions project on our local machine.
*   **How to Install:**
    1.  Open PowerShell **as Administrator**.
    2.  Run this command to install it using `npm`:
        ```powershell
        npm install -g azure-functions-core-tools@4 --unsafe-perm true
        ```
*   **How to Verify:**
    *   **Folder:** `C:\Users\Public\Github` (or any folder)
    *   **Mode:** Normal PowerShell
    *   Run this command:
        ```powershell
        func --version
        ```
    *   You should see a version number like `4.x.x`.

---

## Part 2: Project Setup

Now we will get the project code and install its specific dependencies.

### 1. Clone the Project from GitHub

*   **What it does:** This downloads the project code into your local folder.
*   **Instructions:**
    *   **Folder:** `C:\Users\Public\Github`
    *   **Mode:** Normal PowerShell
    *   Run this command (replace `<your-github-repo-url>` with the actual URL):
        ```powershell
        git clone <your-github-repo-url>
        ```
    *   This will create a `birthday-reminder-app` folder. Navigate into it:
        ```powershell
        cd birthday-reminder-app
        ```

### 2. Install Project Dependencies

*   **What it does:** This downloads all the libraries the frontend and backend need to work.
*   **Instructions:**
    1.  **Install Frontend Dependencies:**
        *   **Folder:** `C:\Users\Public\Github\birthday-reminder-app`
        *   **Mode:** Normal PowerShell
        *   Run this command:
            ```powershell
            npm install
            ```
    2.  **Install Backend Dependencies:**
        *   **Folder:** `C:\Users\Public\Github\birthday-reminder-app`
        *   **Mode:** Normal PowerShell
        *   Run this command:
            ```powershell
            cd api
            npm install
            cd ..
            ```

### 3. Configure Local Secrets

*   **What it does:** You need to provide your secret keys for the backend to connect to the database and email service.
*   **Instructions:**
    1.  Find the file `api/local.settings.json`.
    2.  Open it in a text editor.
    3.  Replace all the placeholder values (like `"YOUR_COSMOS_DB_ENDPOINT_HERE"`) with your actual secret keys from your Azure and Brevo accounts. **Do not share this file.**

---

## Part 3: Running the Application

The application requires two servers running at the same time. You will need **two PowerShell windows** open.

### 1. Start the Backend Server

*   **Folder:** `C:\Users\Public\Github\birthday-reminder-app`
*   **Mode:** Normal PowerShell (Window 1)
*   Run these commands:
    ```powershell
    cd api
    func start
    ```
*   Leave this window open. You should see a list of your API functions running.

### 2. Start the Frontend Server

*   **Folder:** `C:\Users\Public\Github\birthday-reminder-app`
*   **Mode:** Normal PowerShell (Window 2)
*   Run this command:
    ```powershell
    npm start
    ```
*   This should automatically open `http://localhost:3000` in your web browser. The app should now be fully working.
