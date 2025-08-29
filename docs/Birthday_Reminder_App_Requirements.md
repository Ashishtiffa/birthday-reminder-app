# Project Requirement Document  
**Project Name:** Birthday Reminder Web App  
**Prepared By:** Ashish  
**Date:** 2025-08-29  

---

## 1. Project Overview  
The Birthday Reminder Web App is a personal-use application designed to help the user remember friends’ birthdays. The app allows adding, editing, and deleting birthdays, setting custom reminders, and viewing upcoming birthdays in a simple list. Reminders will be sent via email using SendinBlue.  

- **Objective:** To provide a personal web application that helps track and remind birthdays with configurable notifications.  
- **Scope:** Minimal UI with essential features, deployed on Azure Static Web Apps with Azure Functions backend.  

---

## 2. Stakeholders  
- **Primary User:** Ashish (personal use only)  
- **Developer:** Ashish  
- **Third-party Services:**  
  - Azure (Hosting, Functions, Cosmos DB)  
  - SendinBlue (Email reminders)  

---

## 3. Functional Requirements  

### 3.1 Core Features  
1. **Birthday Management** – Add, edit, and delete birthdays manually.  
2. **Custom Reminders** – Configure notifications (same day, 1 day before, 1 week before).  
3. **Upcoming Birthday List** – Show birthdays in a list view.  

### 3.2 Authentication  
- Basic **username + password login** to secure access.  

---

## 4. Non-Functional Requirements  
- **Performance:** App should load within 2 seconds on desktop browsers.  
- **Scalability:** Support for at least a few hundred birthday records.  
- **Security:** Passwords stored securely (hashed) in Cosmos DB.  
- **Usability:** Simple, minimal UI with focus on functionality.  
- **Availability:** 99% uptime via Azure Static Web Apps hosting.  

---

## 5. Technical Requirements  
- **Frontend:** React (hosted on Azure Static Web Apps)  
- **Backend:** Azure Functions (Node.js runtime)  
- **Database:** Azure Cosmos DB (for birthdays & user credentials)  
- **Email Service:** SendinBlue (free plan, 300 emails/day)  

---

## 6. Assumptions and Dependencies  
- Internet connection is required for app usage.  
- User has access to Azure free tier for hosting and Cosmos DB.  
- SendinBlue free plan is sufficient for reminder volume.  

---

## 7. Constraints  
- Must remain within **free tier** limits of Azure and SendinBlue.  
- Minimal UI (no complex design, only list + form).  

---

## 8. Acceptance Criteria  
- User can add, edit, and delete birthdays.  
- User can configure reminder timing per birthday.  
- App sends email reminders correctly via SendinBlue.  
- Login authentication works with username + password.  
- App runs on Azure Static Web Apps with Azure Functions backend.  

---

## 9. Risks  
- **Risk 1:** SendinBlue free tier may change → **Mitigation:** allow switching to another provider (MailJet, Mailgun).  
- **Risk 2:** Azure free tier limits may restrict performance → **Mitigation:** optimize database queries, lightweight design.  

---

## 10. Timeline (Tentative)  
- **Week 1:** Setup project, frontend structure with React.  
- **Week 2:** Implement birthday management (CRUD + Cosmos DB).  
- **Week 3:** Integrate Azure Functions with SendinBlue for email reminders.  
- **Week 4:** Add authentication, final testing, and deploy to Azure Static Web Apps.  

---

## 11. Architecture Diagram  

```mermaid
flowchart TD
    A[User Browser] -->|Access Web App| B[Azure Static Web Apps (React Frontend)]
    B -->|API Calls| C[Azure Functions Backend]
    C -->|CRUD Operations| D[(Cosmos DB)]
    C -->|Send Emails| E[SendinBlue Email Service]
```

---

## 12. Approval  
- **Prepared By:** Ashish  
- **Reviewed By:** Self  
- **Approved By:** Self  
