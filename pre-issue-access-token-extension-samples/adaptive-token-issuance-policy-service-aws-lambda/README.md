# Adaptive Token Issuance Policy

This is a Node.js-based AWS Lambda function that enforces an adaptive access token issuance policy. It blocks tokens from restricted countries and high-risk IP addresses, and dynamically adjusts token lifetimes based on IP reputation and login time.

> **Note:** This sample is for demonstration only and should not be used in production. It supports the **Pre-issue access token action feature** of both [Asgardeo](https://console.asgardeo.io/) and [WSO2 Identity Server](https://wso2.com/identity-server/).

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [External Services Used](#external-services-used)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [1️⃣ Clone the Repository](#1-clone-the-repository)
  - [2️⃣ Install Dependencies](#2-install-dependencies)
  - [3️⃣ Zip the Workspace](#3-zip-the-workspace)
  - [4️⃣ Deploy Lambda Function on AWS](#4-create-lambda-function-on-AWS)
    - [Create Lambda Function](#create-lambda-function)
    - [Add Code and Dependencies](#add-code-and-dependencies)
    - [Set Environmental Variables](#set-environmental-variables)
    - [Enable a Function URL](#enable-a-function-url)
- [Configure the Extension](#7-configure-the-extension)
  - [1️⃣ Create an Appliction](#1-create-an-application)
  - [2️⃣ Set Up Pre-Issue Access Token Action](#1-setup-pre-issue-access-token-action)
- [Test Example Scenarios](#test-example-scenarios)

## Overview

This function implements an adaptive token issuance policy using IP-based compliance and risk analysis. It supports:

- Blocking access tokens from restricted countries and high-risk IPs
- Dynamic token expiry based on IP reputation and login time

## Features

- Blocks access token issuance for restricted countries or regions
- Evaluates IP risk scores using [AbuseIPDB](https://www.abuseipdb.com/)
- Dynamically adjusts token expiry time based on risk score and login time (UTC)
- Allows tokens with full expiry only for low-risk IPs
- Designed to run as an AWS Lambda function for easy deployment

When a client requests an access token:

1. **Geo Compliance Check**  
   - The client's IP address is extracted from the request.
   - If the IP belongs to a **restricted country/region** (e.g., North Korea, Iran, Russia), **token issuance is blocked**.

2. **IP Risk Analysis (AbuseIPDB Integration)**  
   - If the country is allowed, the IP address is checked against **AbuseIPDB** for its **abuse confidence score**.

3. **Token Issuance Policy**  
   Based on the AbuseIPDB score and the login time:
   
   - **Score ≥ 75** → Token issuance is **blocked** (high risk)
   - **Score between 25 and 75**:
     - During **working hours** (9AM–5PM UTC) → Token expiry = **15 minutes**
     - Outside working hours → ⏳ Token expiry = **5 minutes**
   - **Score < 25** → Token expiry = **1 hour**

## External Services Used

- **GeoIP Lookup**  
  - Using [`geoip-country`](https://www.npmjs.com/package/geoip-country) Node.js library for offline IP-to-country resolution.

- **AbuseIPDB Risk Scoring**  
  - Using [AbuseIPDB](https://www.abuseipdb.com/) public API to retrieve the abuse confidence score for IP addresses.
  - Requires an API key (`Key` header) to make risk score lookups.

## Prerequisites

- **Node.js** (>=14.x) – for local development and packaging
- **npm** - to manage dependencies like `geoip-country`
- An AWS Account with permission to create Lambda functions
- AbuseIPDB API Key – for querying IP risk scores

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/asgardeo-samples/asgardeo-service-extension-samples.git
cd pre-issue-access-token-extension-samples/adaptive-token-issuance-policy-service-aws-lambda
```

[← Back to Table of Contents](#table-of-contents)

### 2. Install Dependencies

```bash
npm install
```
[← Back to Table of Contents](#table-of-contents)

### 3. Zip the Workspace

Zip the entire workspace (including `index.mjs`, `node_modules`, and `package.json`):
```bash
zip -r function.zip .
```

[← Back to Table of Contents](#table-of-contents)

### 4. Deploy Lambda Function on AWS

### Create Lambda Function

Go to the [AWS Lambda Console](https://console.aws.amazon.com/lambda/).

Click **Create function** → **Author from scratch**.

Provide the following details:
- **Function name**: `adaptive-token-policy`
- **Runtime**: `Node.js 18.x` (or the latest supported version).

Click **Create function**.

### Add Code and Dependencies

Go to the **AWS Lambda Console**.

Open your Lambda function (`adaptive-token-policy`).

Click **Upload from** → **.zip file**.

Upload the `function.zip` file you just created.

Click **Deploy** to save the changes.

### Set Environmental Variables

Go to the **Configuration** tab → **Environment variables**.

Add the following key-value pair:
- **Key**: `ABUSEIPDB_API_KEY`
- **Value**: Your AbuseIPDB API key.

Click **Save**.

### Enable a Function URL

Go to the **Configuration** tab → **Function URL**.

Click **Create function URL**.

Set **Auth type** to `NONE` (or configure IAM if needed).

Click **Save**.

Note the **Function URL** (e.g., `https://<unique-id>.lambda-url.<region>.on.aws`).

[← Back to Table of Contents](#table-of-contents)

## Configure the Extension

### 1. Create an Application

Navigate to **Applications** → **New Application** in the Console application in Asgardeo or the WSO2 Identity Server.

Select **Standard-Based Application**.

Provide the following details:
- **Name**: `Adaptive Token Policy Demo App`
- **Protocol**: OpenID Connect
- **Grant Types**: Enable `Authorization Code` and `Client Credentials`.

Save the application.

### 2. Set Up Pre-Issue Access Token Action

Navigate to **Actions** → **Pre-Issue Access Token**.

Create a new action:
- **Action Name**: `Adaptive Token Policy`.
- **Endpoint URL**: Paste the Lambda **Function URL** (e.g., `https://<unique-id>.lambda-url.<region>.on.aws`).

Save the action.

> **Note for WSO2 Identity Server Integration:**  
> If you are integrating this extension sample with WSO2 Identity Server, ensure that the `x-client-source-ip` header is forwarded to the service extension point.  
>
> 1. Open the `repository/conf/deployment.toml` file.
> 2. Add the following configuration to allow forwarding the header in token requests:
>
>    ```toml
>    [actions.types.pre_issue_access_token.action_request]
>    allowed_headers = ["x-client-source-ip"]
>    ```
>
> This configuration ensures that the Lambda function receives the client IP address for policy evaluation.


## Test Example Scenarios

Use `curl` or Postman to simulate token requests with different IPs and observe the behavior.

Replace placeholders with actual values:

```bash
curl -X POST https://api.asgardeo.io/t/<tenant>/oauth2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "x-client-source-ip: <client_ip>" \
  -u "<client_id>:<client_secret>" \
  -d "grant_type=authorization_code" \
  -d "code=<authorization_code>" \
  -d "redirect_uri=<redirect_uri>"
```

### Test Scenarios and Examples

1. **Restricted Country**:  
   The IP `175.45.176.0` belongs to a restricted country (North Korea). The request will be blocked.

2. **High Abuse Score**:  
   The IP `103.159.198.178` has an abuse confidence score > 75. The request will be blocked due to high risk.

3. **Moderate Abuse Score (Working Hours)**:  
   The IP `14.102.69.58` has an abuse confidence score in between 25 & 75. During working hours (9AM–5PM UTC), the token will be issued with a 15-minute expiry.

4. **Moderate Abuse Score (Outside Working Hours)**:  
   The IP `14.102.69.58` has an abuse confidence score in between 25 & 75. Outside working hours, the token will be issued with a 5-minute expiry.

5. **Low Abuse Score**:  
   The IP `205.210.31.51` has an abuse confidence score < 25. The token will be issued with a 1-hour expiry.
