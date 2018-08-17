[![Build Status](https://travis-ci.org/yhagio/blockchain_rest_api.svg?branch=master)](https://travis-ci.org/yhagio/blockchain_rest_api)

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

| Endpoint                | Params format                 | Returning JSON on success                                                                  |
| ----------------------- | ----------------------------- | ------------------------------------------------------------------------------------------ |
| GET /block/:id          | id: number                    | { hash: string, height: number, body: string, time: timestamp, previousBlockHash: string } |
| POST /block             | body (JSON): { body: string } | { hash: string, height: number, body: string, time: timestamp, previousBlockHash: string } |
| GET /block/validate_all | N/A                           | { isValid: boolean }                                                                       |
| GET /block/validate/:id | id: number                    | { isValid: boolean }                                                                       |
| GET /block/height       | N/A                           | { blockHeight: number }                                                                    |

### curl commands to test

```bash
# GET /block/0
curl "http://localhost:8000/block/0"
# POST /block
curl -X "POST" "http://localhost:8000/block" -H 'Content-Type: application/json' -d $'{"body":"awesome test body"}'
# GET /block/validate/1 - Validate the block at height 1
curl "http://localhost:8000/block/validate/1"
# GET /block/validate_all - Validate the whole blockchain
curl "http://localhost:8000/block/validate_all"
# GET /block/height - Get the blockchain height
curl "http://localhost:8000/block/height"
```
