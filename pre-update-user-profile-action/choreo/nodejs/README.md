# Validate User Profile Update – Node.js API (Choreo Deployment)

A Node.js-based microservice deployed on **Choreo** that acts as a **Pre-Update Profile Action** handler. It validates user department claims and sends email alerts when sensitive attributes are being updated.

## 📑 Table of Contents

- [Validate User Profile Update – Node.js API (Choreo Deployment)](#validate-user-profile-update-nodejs-api-choreo-deployment)
    * [📑 Table of Contents](#-table-of-contents)
    * [🧩 Overview](#-overview)
    * [✨ Features](#-features)
    * [📦 Prerequisites](#-prerequisites)
    * [⚙️ Setup Instructions](#-setup-instructions)
        + [Create Project & Component:](#create-project-component)
        + [Build & Deploy:](#build-deploy)
        + [Publish API:](#publish-api)
        + [Generate API Key:](#generate-api-key)
        + [Local Setup (For Development & Testing)](#local-setup-for-development-testing)
    * [🛠️ Configure the Pre User Profile Update Action in Product](#-configure-the-pre-user-profile-update-action-in-product)
        + [Configuring the Action in WSO2 Identity Server](#configuring-the-action-in-wso2-identity-server)
        + [Configuring the Action in Asgardeo](#configuring-the-action-in-asgardeo)
    * [🔌 API Endpoints](#-api-endpoints)
        + [POST /api/validate-user-profile-update](#post-apivalidate-user-profile-update)
            - [Description](#description)
            - [Request Body (example)](#request-body-example)
            - [Success Response](#success-response)
            - [Failure Responses](#failure-responses)
                * [Unauthorized API Key](#unauthorized-api-key)
                * [Invalid Action Type](#invalid-action-type)
                * [Invalid Department](#invalid-department)
                * [Email Sending Failure](#email-sending-failure)
        + [GET /api](#get-api)
            - [Description](#description-1)
            - [Response](#response)
    * [🔐 Environment Variables](#-environment-variables)

---

## 🧩 Overview

This microservice is designed to plug into an identity management workflow such as WSO2 Identity Server's **Pre-Update Profile Action**. It validates certain user claims (department) and notifies a security team via email if updates to sensitive attributes like department, email, or phone are detected.

[← Back to Table of Contents](#-table-of-contents)

---

## ✨ Features

- 🔐 Secured via API key authentication
- ✅ Validates department field against a whitelist
- 📧 Sends email alerts when sensitive claims are updated
- ☁️ Runs on Choreo with built-in observability and scalability

[← Back to Table of Contents](#-table-of-contents)

---

## 📦 Prerequisites

- A [Choreo account](https://wso2.com/choreo/)
- Node.js 22+ for local development and testing
- Mailtrap or any SMTP server credentials for sending emails
- API client (e.g., Postman) for sending test requests

[← Back to Table of Contents](#-table-of-contents)

---

## ⚙️ Setup Instructions

### Create Project & Component:

- Log in to the Choreo Console and create a new project. 
- In the project, go to Components and create a new component. 
- Choose API Service as the component type. 
- Link your GitHub account and select the GitHub repository.

### Build & Deploy:

- After the build, go to the Deploy tab and click Configure and Deploy. 
- Provide required environment variables (e.g., email credentials).
- Enable API Key protection for secure access.

### Publish API:

- Copy the provided API URL after deployment. 
- Go to Manage > Lifecycle, then click Publish to change the state to "Published".

### Generate API Key:

- Click Go to Devportal in the top right. 
- In Devportal, go to Credentials > Sandbox and generate an API key. 
- Copy and securely store the generated key (created with an application in Asgardeo).

### Local Setup (For Development & Testing)

1. Clone the Repository:
    
    ```bash
    git clone https://github.com/<your-username>/profile-update-validator.git
    cd profile-update-validator

2. Install Dependencies:

    ```bash
    npm install

3. Create a .env File: Add a .env file in the root directory with required environment variables, e.g.:

    ```env
    EMAIL_USERNAME=your_email@example.com
    EMAIL_PASSWORD=your_email_password

4. Run the Server:

    ```bash
    node index.js
    ```
    The API should now be running locally at http://localhost:3000 (or your configured port).

[← Back to Table of Contents](#-table-of-contents)

---

## 🛠️ Configure the Pre User Profile Update Action in Product

### Configuring the Action in WSO2 Identity Server
To integrate this service with WSO2 Identity Server, follow the step-by-step guide at the [documentation](https://is.docs.wso2.com/en/next/guides/service-extensions/pre-flow-extensions/pre-update-profile-action/).

### Configuring the Action in Asgardeo
To integrate this service with Asgardeo, follow the step-by-step guide at the [documentation](https://wso2.com/asgardeo/docs/guides/service-extensions/pre-flow-extensions/pre-update-profile-action/).

[← Back to Table of Contents](#-table-of-contents)

---

## 🔌 API Endpoints

### POST /api/validate-user-profile-update

#### Description
Validates department and checks if sensitive attributes are being updated. If so, an email alert is triggered.

| Headers Key |	Value            |
| ----------- | ---------------- |
|api-key	  | your_api_key     |
|Content-Type | application/json |

#### Request Body (example)

```json
{
  "actionType": "PRE_UPDATE_PROFILE",
  "event": {
    "request": {
      "claims": [
        {
          "uri": "http://wso2.org/claims/department",
          "value": "HR"
        },
        {
          "uri": "http://wso2.org/claims/mobile",
          "value": "+94771223448"
        },
        {
          "uri": "http://wso2.org/claims/emailaddress",
          "value": "testuser@wso2.com"
        }
      ]
    },
    "tenant": {
      "id": "2210",
      "name": "deshankoswatte"
    },
    "user": {
      "id": "57b22cbf-4688-476c-a607-c0c9d089d25d",
      "claims": [
        {
          "uri": "http://wso2.org/claims/username",
          "value": "testuser@wso2.com"
        },
        {
          "uri": "http://wso2.org/claims/identity/userSource",
          "value": "DEFAULT"
        },
        {
          "uri": "http://wso2.org/claims/identity/idpType",
          "value": "Local"
        }
      ]
    },
    "userStore": {
      "id": "REVGQVVMVA==",
      "name": "DEFAULT"
    },
    "initiatorType": "ADMIN",
    "action": "UPDATE"
  }
}
```

#### Success Response

```json
{
  "actionStatus": "SUCCESS"
}
```

#### Failure Responses

##### Unauthorized API Key

```json
{
  "actionStatus": "FAILED",
  "failureReason": "unauthorized",
  "failureDescription": "Invalid or missing API key."
}
```

##### Invalid Action Type

```json
{
  "actionStatus": "FAILED",
  "failureReason": "invalid_input",
  "failureDescription": "Invalid actionType provided."
}
```

##### Invalid Department

```json
{
  "actionStatus": "FAILED",
  "failureReason": "invalid_department_input",
  "failureDescription": "Provided user department value is invalid."
}
```

##### Email Sending Failure

```json
{
  "actionStatus": "FAILED",
  "failureReason": "email_error",
  "failureDescription": "Failed to notify security team about sensitive data update."
}
```

[← Back to Table of Contents](#-table-of-contents)

---

### GET /api

#### Description

Simple home endpoint for testing deployment.

#### Response

```text
Hello from the home endpoint!
```

[← Back to Table of Contents](#-table-of-contents)

---

## 🔐 Environment Variables

|   Variable    | Description                    |
| ------------- |--------------------------------|
| MAILTRAP_USER	| Mailtrap username for SMTP     |
| MAILTRAP_PASS	| Mailtrap password for SMTP     |

[← Back to Table of Contents](#-table-of-contents)

---
