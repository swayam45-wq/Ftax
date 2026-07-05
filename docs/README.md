# FTax Documentation

Welcome to the documentation for **FTax**, the F-1 International Student Tax Assistant built specifically for the University of Illinois Chicago (UIC).

## Table of Contents

1. [System Architecture](./architecture.md) - Overview of the monorepo, tech stack, and application structure.
2. [Local Setup Guide](./setup.md) - Step-by-step instructions for running the application locally.
3. [Tax Residency Engine](./tax-engine.md) - Deep dive into how the rule-based residency engine works.
4. [API Reference](./api.md) - Overview of the backend NestJS REST API.

## Project Goal
FTax is an educational tool designed to help F-1 international students determine their U.S. tax residency status (Resident Alien vs. Nonresident Alien) based on the Substantial Presence Test, identify the forms they need to file (like Form 8843 and Form 1040-NR), and safely store their information.

> **Note:** FTax is not an IRS e-file provider. It prepares students with the information and PDFs they need to file their taxes independently.
