# API Reference

The FTax backend is a REST API built with NestJS. It is exposed at `/api/v1` and documented automatically via Swagger.

## Swagger Documentation

When running locally, you can view and test the full API documentation at:
**[http://localhost:3001/api/docs](http://localhost:3001/api/docs)**

## Endpoint Overview

### Authentication (`/auth`)
* `POST /auth/register` - Create a new student account
* `POST /auth/login` - Authenticate and receive a JWT and HTTP-only refresh cookie
* `POST /auth/refresh` - Rotate the refresh token and get a new JWT
* `POST /auth/logout` - Invalidate the refresh token and clear the cookie
* `GET /auth/verify-email` - Verify email address using token
* `POST /auth/forgot-password` - Trigger a password reset email
* `POST /auth/reset-password` - Reset password using token
* `GET /auth/me` - Get current authenticated user details

### Profile (`/profile`)
* `GET /profile` - Retrieve the user's profile and completion percentage
* `PUT /profile` - Update profile information (encrypts SSN/ITIN at rest)
* `GET /profile/travel` - Get all travel history entries
* `POST /profile/travel` - Add a new travel history entry
* `DELETE /profile/travel/:id` - Delete a travel history entry

### Tax Engine (`/tax`)
* `POST /tax/residency-check` - Run the Residency Engine against the user's travel history and return the Substantial Presence Test result and forms checklist
* `GET /tax/rules/current` - Retrieve the raw JSON ruleset for the current tax year

## Authentication Flow

The frontend API client uses an Axios interceptor to automatically attach the `Authorization: Bearer <token>` header to all requests. If a request returns a `401 Unauthorized`, the interceptor automatically calls `/auth/refresh` to rotate the HTTP-only cookie, gets a new access token, and retries the original request seamlessly.
