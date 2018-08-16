# Blockchain Web Service REST API

### How to set up

Clone this repo and get in.
Recommended to use nvm.

```bash
nvm use && npm i # Install necessary dependencies
```

### Available commands

```bash
npm start    # Start the application locally at localhost:8000
npm run lint # Ensures there's no linting errors
npm test     # run lint + unit tests
```

### Available API endpoints

| Endpoint       | Params format                 | Returning JSON                                                                             |
| -------------- | ----------------------------- | ------------------------------------------------------------------------------------------ |
| GET /block/:id | id: number                    | { hash: string, height: number, body: string, time: timestamp, previousBlockHash: string } |
| POST /block    | body (JSON): { body: string } | { hash: string, height: number, body: string, time: timestamp, previousBlockHash: string } |
