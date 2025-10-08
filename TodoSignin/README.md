# Todo app

A simple Todo app with sign-up and sign-in feature.

## Features

- User authentication (sign-in)
- Secure password handling
- Error messages for invalid login

## Installation

```bash
npm install
```

## Usage

1. Start the server:
    ```bash
    npm start
    ```
2. Open your browser and go to `http://localhost:3000`

## Environment Variables

Create a `.env` file in the project root and add your secrets:

```
JWT_SECRET=your_secret_key
```

## Folder Structure

```
TodoSignin/
├── node_modules/ (ignored)
├── public/
├── index.js
├── todos.json
├── package.json
├── package-lock.json
├── .env (ignored)
```
