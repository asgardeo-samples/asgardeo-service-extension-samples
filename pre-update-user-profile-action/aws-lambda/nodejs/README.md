# Validate User Profile Update – Node.js API (Choreo Deployment)

A Node.js-based AWS Lambda function designed to act as a **Pre-Update Profile Action** hook. It validates user profile update claims and sends email alerts when sensitive attributes are changed.

## 📑 Table of Contents

- [Validate User Profile Update – Node.js API (Choreo Deployment)](#validate-user-profile-update-nodejs-api-choreo-deployment)
    * [📑 Table of Contents](#-table-of-contents)
    * [🧩 Overview](#-overview)
    * [✨ Features](#-features)
    * [📦 Prerequisites](#-prerequisites)
    * [⚙️ Setup Instructions](#-setup-instructions)
        + [Create the Deployment Package](#create-the-deployment-package)
        + [Deploy the Function on AWS Lambda](#deploy-the-function-on-aws-lambda)
        + [Configure Function URL](#configure-function-url)
        + [Configure Environment Variables](#configure-environment-variables)
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

This function validates department updates against a whitelist and sends alert emails if sensitive user attributes (like department, email, or phone) are changed.

[← Back to Table of Contents](#-table-of-contents)

---

## ✨ Features

- ✅ Department claim whitelisting
- 📧 Email alerts for sensitive changes
- ☁️ Deployed on AWS Lambda with API Gateway as the trigger

[← Back to Table of Contents](#-table-of-contents)

---

## 📦 Prerequisites

- AWS CLI and access to an AWS account
- Node.js 22+ for local development
- SMTP credentials (e.g., Mailtrap)

[← Back to Table of Contents](#-table-of-contents)

---

## ⚙️ Setup Instructions

### Create the Deployment Package

- Zip the Project: Run the following command in the project root to include all necessary files:
    
    ```bash
    zip -r validate-user-profile-update.zip .
    ```
  
    This will include: index.js, .env (optional, used only locally), and node_modules/

### Deploy the Function on AWS Lambda

- Create the Function:
  - Go to the AWS Lambda Console.
  - Click Create function and select Author from scratch.
  - Fill in the following:
    - Function name: validate-user-profile-update
    - Runtime: Node.js 22.x
    - Architecture: x86_64
    - Permissions: Select an existing role or create a new one with basic Lambda permissions.

- Upload the Code:
  - After the function is created, go to the Code tab.
  - Click Upload from > .zip file and select validate-user-profile-update.zip.
  - Click Save to deploy the uploaded code.

### Configure Function URL

- Enable Function URL:
  - Go to the Configuration tab.
  - Select Function URL.
  - Click Create function URL.
  - Set Auth type to None.

- Copy the URL:
  - The generated URL will appear in the Function overview.
  - Save this URL — it exposes your function to external services.

### Configure Environment Variables

- Add SMTP Credentials:
  - Go to Configuration > Environment variables.
  - Click Edit and add:
  ```env
      EMAIL_USERNAME=your_email@example.com
      EMAIL_PASSWORD=your_email_password
  ```
  - Save the changes.

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
