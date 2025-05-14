# M2M Scope Limiting Policy 

This is a Ballerina-based service hosted on Choreo that enforces strict scope control for machine-to-machine (M2M) access tokens. It limits the scopes in authorized tokens to `read:metrics` when issued using the client credentials grant, regardless of the application's full scope authorization.

> **Note:** This sample is for demonstration only and should not be used in production. It supports the **Pre-issue access token action feature** of both [Asgardeo](https://console.asgardeo.io/) and [WSO2 Identity Server](https://wso2.com/identity-server/).

## Table of Contents
- [Overview](#overview)
- [Scenario](#scenario)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [1️⃣ Fork the Repository](#1-fork-the-repository)
  - [2️⃣ Create a Component in Choreo](#4-create-a-component-in-choreo)
  - [3️⃣ Deploy the Component](#4-deploy-the-component)
- [Configure the Extension](#7-configure-the-extension)
  - [1️⃣ Create an Appliction](#1-create-an-application)
  - [2️⃣ Register API Resources](#1-register-api-resources)
  - [3️⃣ Authorize the Application](#1-authorize-the-application)
  - [4️⃣ Set Up Pre-Issue Access Token Action](#1-setup-pre-issue-access-token-action)
- [Test the Service](#test-the-service)

## Overview

This service enforces strict scope control for M2M tokens issued via the client credentials grant. It supports:
- Limiting token scopes to `read:metrics` only
- Filtering out all other authorized scopes at token issuance time
- Default behavior passthrough for other grant types

## Scenario

You have an application in Asgardeo that is allowed to request a wide range of scopes for internal service access:

- `read:metrics`  
- `write:alerts`  
- `read:users`  
- `write:config`

While these scopes are all authorized at the app level, you want to **restrict M2M tokens (i.e., tokens obtained via `client_credentials` grant type)** so that only the `read:metrics` scope is permitted. This is common in analytics/reporting services where a background job should not access sensitive config or user data.

When an access token is requested using the **client credentials** grant type:

- All scopes **except** `read:metrics` are **removed**.
- Only the `read:metrics` scope is retained in the final access token.
- For all other grant types, the token issuance proceeds without modification.

## Prerequisites

Make sure you have the following installed and configured before deploying the service:
  
- A **GitHub account** connected to [Choreo Console](https://console.choreo.dev)

- Access to **Choreo Console** to deploy and manage your service

- _(Optional)_ A **Choreo API key** if you plan to secure the endpoint using API key authentication

## Setup Instructions

### 1. Fork the Repository in Github

Fork this repository to your Github account.

[← Back to Table of Contents](#table-of-contents)

### 2. Create a Component in Choreo

Log in to [Choreo Console](https://console.choreo.dev).

Click **+ +Create** under **Component Listing**.

Select **Service** as type.

Select **Authorize with Github** under **Connect a Git Repository**.

Select the forked repository and **main** branch.

Set `pre-issue-access-token-extension-samples/m2m-scope-limiting-policy-service-ballerina` as the **Component Directory**.

Select **Ballerina** under **Build Presets**.

Click **Create**.

Wait for the build action to complete.

[← Back to Table of Contents](#table-of-contents)

### 3. Deploy the Component

Navigate to the **Deploy** tab.

Configure & Deploy to Development.

Promote to Production.

## Configure the Extension

### 1. Create an Application

Navigate to **Applications** → **New Application** in the Console application in Asgardeo or the WSO2 Identity Server.

Select **Standard-Based Application**.

Provide the following details:
- **Name**: `M2M Scope Limiting Policy Demo App`
- **Protocol**: OpenID Connect
- **Grant Types**: Enable `Authorization Code` and `Client Credentials`.

Save the application.

### 2. Register API Resources

Create the following resources with associated scopes:

| Resource Name   | Scopes                     |
|-----------------|----------------------------|
| Metrics API     | `read:metrics`             |
| Alerts API      | `write:alerts`             |
| Users API       | `read:users`               |
| Config API      | `write:config`             |

### 3. Authorize the Application

1. Go back to the application.
2. Under **API Authorization**, click **+ Authorize API**.
3. For each of the created API resources, **authorize all available scopes**.

Your application is now allowed to request a **broad set of scopes**, but your Pre-Issue Access Token Extension will enforce the `read:metrics` scope restriction when the client uses the `client_credentials` grant.

### 4. Set Up Pre-Issue Access Token Action

Navigate to **Actions** → **Pre-Issue Access Token**.

Create a new action:
- **Action Name**: `M2M Scope Limiter`.
- **Endpoint URL**: Use your Choreo HTTPS URL (e.g., `https://m2m-scope-limiter--<org>.apps.choreo.dev/filter`).
- (Optional) Enable authentication and configure a secret if using an API key.

Save the changes.

[← Back to Table of Contents](#table-of-contents)

## Test the Service

You can test the policy using the **token endpoint** in Asgardeo. Use `curl` or Postman to simulate token requests with different scopes.


| **Scenario**                     | **Expected Result**                              |
|-----------------------------------|-------------------------------------------------|
| Grant type is not `client_credentials` | Token is issued without modification.         |
| Grant type is `client_credentials` with allowed scope (`read:metrics`) | Token is issued with the scope intact.        |
| Grant type is `client_credentials` with disallowed scopes | Disallowed scopes are removed from the token. |

Replace placeholders with actual values:

```bash
curl -X POST https://api.asgardeo.io/t/<tenant>/oauth2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -u "<client_id>:<client_secret>" \
  -d "grant_type=client_credentials" \
  -d "scope=read:metrics write:users"
```

[← Back to Table of Contents](#table-of-contents)