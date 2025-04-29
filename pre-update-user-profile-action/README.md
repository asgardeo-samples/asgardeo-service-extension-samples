# Profile Update Validator Service Samples

This repository contains sample implementations of a profile update validation service that can be integrated with Asgardeo or WSO2 Identity Server. These samples demonstrate how to build and deploy the service using Node.js/Express, and expose it securely through Choreo and AWS Lambda.

## 📚 Table of Contents

- [Profile Update Validator Service Samples](#profile-update-validator-service-samples)
    * [📚 Table of Contents](#-table-of-contents)
    * [📝 Overview](#-overview)
    * [🧪 Samples](#-samples)
        + [☁️ Choreo Deployment](#-choreo-deployment)
        + [⚙️ AWS Lambda Deployment](#-aws-lambda-deployment)
        + [🌍 Vercel Deployment](#-vercel-deployment)
    * [🚀 Getting Started](#-getting-started)

## 📝 Overview

The profile update validator service can help enforce business rules and external validations before a user's profile is updated. This enhances security, prevents invalid data updates, and ensures compliance with external systems.

This repository includes multiple deployment methods:
- Cloud-native deployment with WSO2 Choreo 
- Serverless deployment via AWS Lambda 
- Edge deployment via Vercel

## 🧪 Samples

### ☁️ Choreo Deployment

Provides a declarative deployment experience integrated with GitHub. API Key protection and lifecycle management included.

### ⚙️ AWS Lambda Deployment

Serverless deployment by uploading a zipped package with environment variables configured via AWS Lambda console.

### 🌍 Vercel Deployment

Easily deploy and host the validator as a serverless API using Vercel, suitable for low-latency edge execution.

## 🚀 Getting Started

To get started with any of the samples, navigate to the respective project directory and follow the setup instructions provided in the project's README file.

- [Choreo](./choreo/README.md)
- [Vercel](./vercel/README.md)
- [AWS Lambda](./aws-lambda/README.md)
