# Password Update Service Samples

This repository contains sample implementations of password update services for [Asgardeo](https://console.asgardeo.io/) and [WSO2 Identity Server](https://wso2.com/identity-server/). These samples demonstrate how to create and configure a password update mechanism as an external service extension to the product.

## Table of Contents
- [Overview](#overview)
- [Samples](#samples)
- [Getting Started](#getting-started)

## Overview
The password update service samples in this repository are designed to help developers understand how to extend the password validation capabilities of Asgardeo and WSO2 Identity Server. Each sample provides an integration with [HaveIBeenPwned (HIBP)](https://haveibeenpwned.com/) and can be used as a reference for building your own custom password update services. The password update service can be used to enhance security by preventing users from using compromised passwords.

## Samples
### Express-based HIBP Service
Located in [hibp-integration-express](hibp-intergration-express/README.md), this sample demonstrates how to implement a password update service that checks if the new password has been compromised in data breaches using the HaveIBeenPwned API using Node.js and Express.

### Ballerina-based HIBP Service
Located in [hibp-integration-ballerina](hibp-integration-ballerina/README.md), this sample demonstrates how to implement a password update service that checks if the new password has been compromised in data breaches using the HaveIBeenPwned API using Ballerina.

## Getting Started
To get started with any of the samples, navigate to the respective project directory and follow the setup instructions provided in the project's README file.