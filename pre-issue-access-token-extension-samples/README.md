# Pre-Issue Access Token Extension Samples

This repository contains sample implementations of pre-issue access token extension for [Asgardeo](https://console.asgardeo.io/) and [WSO2 Identity Server](https://wso2.com/identity-server/). These samples demonstrate how to intercept and modify access token issuance behavior using external extension services.

## Table of Contents
- [Overview](#overview)
- [Samples](#samples)
- [Getting Started](#getting-started)

## Overview
The pre-issue access token extension samples in this repository are designed to help developers understand how to customize and control the access token issuance process in Asgardeo and WSO2 Identity Server. Each sample illustrates a practical scenario where access tokens are filtered, modified, or conditionally rejected based on different policies and can be used as a reference for building your own custom authenticators.

## Samples
### Adaptive Token Issuance Policy 
Located in [adaptive-token-issuance-policy](adaptive-token-issuance-policy-service-aws-lambda/README.md), this sample implements a Lambda-based service that applies contextual policies during token issuance, including location-based restrictions, risk assessment, and dynamic token lifetime adjustments.

### M2M Scope Limiting Policy 
Located in [m2m-scope-limiting-policy](m2m-scope-limiting-policy-service-ballerina/README.md), this sample demonstrates how to limit authorized scopes in M2M access tokens using Ballerina and Choreo.

## Getting Started
To get started with any of the samples, navigate to the respective project directory and follow the setup instructions provided in the project's README file.