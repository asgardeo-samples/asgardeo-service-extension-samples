# HIBP Password Validator Service with Ballerina

This is a Ballerina-based password validation service that integrates with the [HaveIBeenPwned (HIBP)](https://haveibeenpwned.com/) API to check if a password has been compromised in data breaches when a user attempts to update their password.

> **Note:** This sample is for demonstration only and should not be used in production. It supports the **Pre Update Password Action** of both [Asgardeo](https://console.asgardeo.io/) and [WSO2 Identity Server](https://wso2.com/identity-server/).

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [1️⃣ Clone the Repository](#1-clone-the-repository)
  - [2️⃣ Run the Service](#2-run-the-service)
    - [Run the Service Locally](#run-the-service-locally)
    - [Deploy to Choreo (Required for Asgardeo)](#deploy-to-choreo-required-for-asgardeo)
  - [3️⃣ Verify the Service](#3-verify-the-service)
- [Configure the Action in Product](#configure-the-action-in-product)
  - [In WSO2 Identity Server](#configuring-the-action-in-wso2-identity-server)
  - [In Asgardeo](#configuring-the-action-in-asgardeo)
- [API Endpoints](#api-endpoints)

## Overview
This service implements a custom password validation mechanism that checks if a password has been compromised using the [HaveIBeenPwned (HIBP)](https://haveibeenpwned.com/) API. It can be used as an external service extension for both Asgardeo and WSO2 Identity Server.

## Features
- [HaveIBeenPwned (HIBP)](https://haveibeenpwned.com/) API integration for password compromise checks
- Compatible with **Choreo** deployments

## Prerequisites
Ensure you have the following installed:
- **Ballerina Swan Lake** (>=2201.0.0)
- **npm**

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/asgardeo-samples/asgardeo-service-extension-samples.git
cd password-update-service-samples/hibp-integration-ballerina/
```

[← Back to Table of Contents](#table-of-contents)

### 2. Run the Service

### Run the Service Locally

```bash
bal run
```

The service will be available at: **[http://localhost:3000](http://localhost:3000)**

[← Back to Table of Contents](#table-of-contents)

### Deploy to Choreo (Required for Asgardeo)
// TODO: Add instructions for deploying to Choreo


[← Back to Table of Contents](#table-of-contents)

### 3. Verify the Service
// TODO: Add instructions for verifying the service

[← Back to Table of Contents](#table-of-contents)

## Configure the Action in Product

### Configuring the Action in WSO2 Identity Server
To integrate this service with WSO2 Identity Server, follow the step-by-step guide at the [documentation](https://is.docs.wso2.com/en/next/guides/service-extensions/pre-flow-extensions/pre-update-password-action/).

### Configuring the Action in Asgardeo
To integrate this service with Asgardeo, follow the step-by-step guide at the [documentation](https://wso2.com/asgardeo/docs/guides/service-extensions/pre-flow-extensions/pre-update-password-action/).

### Considerations applicable for both products

When configuring the pre-update password action, consider the following:

1. Currently the sample only supports plain text password sharing format. Ensure that the password is sent in plain text format. As this is not safe, we recommend using this only for testing purposes. We are working on adding support for other formats (SHA-256) in the sample.

2. HIBP service will only accepts passwords which are SHA-1 or an NTLM hashed - [reference](https://haveibeenpwned.com/API/v3#SearchingPwnedPasswordsByRange). So, if you are using a different hashing algorithm, you will need to implement the hashing in the service.

[← Back to Table of Contents](#table-of-contents)

## API Endpoints

### **Health Check**

This endpoint is to check if the service is successfully running.

- **GET** `/`
- **Response:** `{ "status": "ok", "message": "Service is running." }`

### **Validate Password**

This is the endpoint that will receive requests from the Identity Server for password validation.

- **POST** `/passwordcheck`
- **Request Body:**

```json
{
    "actionType": "PRE_UPDATE_PASSWORD",
    "event": {
        "tenant": {
            "id": "xxxx",
            "name": "org_name"
        },
        "user": {
            "id": "d2366242-xxxx-xxxx-xxxx-d5ee733ae913",
            "updatingCredential": {
                "type": "PASSWORD",
                "format": "PLAIN_TEXT",
                "value": "password_value"
            }
        },
        "userStore": {
            "id": "REVGQVVMVA==",
            "name": "DEFAULT"
        },
        "initiatorType": "USER",
        "action": "RESET"
    }
}
```

- **Response (When password is compromised):**

```json
{
    "actionStatus": "FAILED",
    "failureReason": "password_compromised",
    "failureDescription": "The provided password is compromised."
}
```
- **Response (When password is not compromised):**

```json
{
    "actionStatus": "SUCCESS",
    "message": "Password is not compromised."
}
```

[← Back to Table of Contents](#table-of-contents)