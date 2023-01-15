
# 🔐 NestJS Auth JWT : Refresh token rotation and reuse detection

A small project created in NestJS (Typescript) to implement authentication with JWT,
access token and refresh token.
The goal of this project is to implement refresh token reuse
detection and token rotation.

## 📜 Content table

1. [Database Modelisation](#database-modelisation)
2. [Endpoints](#endpoints)
    - [Sign up](#sign-up)
    - [Sign in](#sign-in)
    - [Refresh](#refresh)
    - [Get me](#get-me)
    - [Log out](#logout)

## Database Modelisation

### User
| Field           | Type                                | 
|-----------------|-------------------------------------|
| ID              | [PK] integer                        |
| email           | varchar                             |
| hashPassword    | varchar                             |
| salt            | varchar                             |
| refreshTokens   | OneToMany: RefreshToken             |

### RefreshToken
| Field           | Type                                | 
|-----------------|-------------------------------------|
| ID              | [PK] integer                        |
| refreshToken    | varchar                             |
| user            | ManyToOne: User                     |


## Endpoints

### Sign up
```
POST /api/v1/auth/signup
```
```
body: {
    email: '',
    password: ''
}
```
When a user registers, the API creates a new user in the database, storing the email, and the hashed password.
The API returns two generated tokens:
- the access token (contains the user ID, and expires after 5 minutes)
- the refresh token (contains the user ID, and expires after 365 days)

The API also stores the refresh token in the database, in relation (ManyToOne) with the just created user.

### Sign in
```
POST /api/v1/auth/signin
```
```
body: {
    email: '',
    password: ''
}
```
When a user logs in, the API searches the database to see if a user exists with the email received in the body.
If the user exists, the API checks if the password received in the body matches the hash stored in the database.
If the password matches, the API returns two generated tokens:
- the access token (contains the user ID, and expires after 5 minutes)
- the refresh token (contains the user ID, and expires after 365 days)

The API also stores the refresh token in the database, in relation (ManyToOne) with the just logged in user.

### Refresh
```
POST /api/v1/auth/refresh
```
```
body: {
    refreshToken: ''
}
```
When the access token of a user expires (after 5 minutes), he must use his refresh token to ask the API for a new couple AccessToken / RefreshToken.
The API decodes the refresh token, to get the user ID. The API then searches the database for the user via his ID.

Then, the API searches the database for the refresh token received in the body.
- If the refresh token exists, the API deletes it, and generates a new pair of tokens.
- On the other hand, if the token does not exist, it means that it has already been used,
    so that the user's tokens have been compromised. This is the token reuse detection.
    In this case, the API deletes all the refresh tokens related to the user in question,
    to encourage the user to reconnect ([/signin](#sign-in)).

### Get me
```
GET /api/v1/users/me
```
This is a simple protected endpoint, that will return the user's information if the request is made with
a valid access token in the request's headers. Otherwise, it will return 401 Unauthorized.


### Log out
```
DELETE /api/v1/auth/logout
```
```
body: {
    refreshToken: ''
}
```
This endpoint is called when the user decides to disconnect from the application to which this API is linked. 

The API decodes the token to retrieve the user's ID, then searches for the user in the database.
Then, the API looks for the refresh token received in the database, and deletes it.