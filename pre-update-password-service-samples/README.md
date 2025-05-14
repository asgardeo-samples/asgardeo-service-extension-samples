# Pre Update Password Service Samples Samples

This repository contains sample implementations of password update validation service for [Asgardeo](https://console.asgardeo.io/) and [WSO2 Identity Server](https://wso2.com/identity-server/). These samples demonstrate how to create and configure a password validation mechanism as an external service extension to the product.

## Table of Contents
- [Overview](#overview)
- [Samples](#samples)
- [Getting Started](#getting-started)

## Overview
The password validation service samples in this repository are designed to help developers understand how to extend the password validation capabilities of Asgardeo and WSO2 Identity Server. Each sample provides an integration with [HaveIBeenPwned (HIBP)](https://haveibeenpwned.com/) and can be used as a reference for building your own custom password validation services. The password validation service can be used to enhance security by preventing users from using compromised passwords.

## Samples
### HIBP Password Validator Service with Express
Located in [hibp-password-validator-service-express](hibp-password-validator-service-express/README.md), this sample demonstrates how to implement a password validation service that checks if the new password has been compromised in data breaches using the HaveIBeenPwned API using Node.js and Express.

### HIBP Password Validator Service with Ballerina
Located in [hibp-password-validator-service-ballerina](hibp-password-validator-service-ballerina/README.md), this sample demonstrates how to implement a password validation service that checks if the new password has been compromised in data breaches using the HaveIBeenPwned API using Ballerina.

## Getting Started
To get started with any of the samples, navigate to the respective project directory and follow the setup instructions provided in the project's README file.