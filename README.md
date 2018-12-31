[![Build Status](https://travis-ci.org/yhagio/blockchain_rest_api.svg?branch=master)](https://travis-ci.org/yhagio/blockchain_rest_api)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/yhagio/blockchain_rest_api/blob/master/LICENSE)

# Blockchain Web Service REST API

### Built with

- [Express](https://github.com/expressjs/express)
- [LevelDB](https://github.com/Level/level)
- [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib)
- [bitcoinjs-message](https://github.com/bitcoinjs/bitcoinjs-message)

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

| Endpoint                | Params format                 | Returning JSON on success                                                                    |
| ----------------------- | ----------------------------- | -------------------------------------------------------------------------------------------- |
| GET /block/all          | N/A                           | [{ hash: string, height: number, body: string, time: timestamp, previousBlockHash: string }] |
| GET /block/validate_all | N/A                           | { isValid: boolean }                                                                         |
| GET /block/validate/:id | id: number                    | { isValid: boolean }                                                                         |
| GET /block/height       | N/A                           | { blockHeight: number }                                                                      |
| POST /block             | body (JSON): { address: string, star: { ra: string, dec: string, story: string } } | { hash: string, height: number, body: { address: string, status: { ra: string, dec: string, story: string, decodedStory: string }}, time: timestamp, previousBlockHash: string }   |
| GET /stars/address::address          | address: string                    | [{ hash: string, height: number, body: { address: string, status: { ra: string, dec: string, story: string, decodedStory: string }}, time: timestamp, previousBlockHash: string }]   |
| GET /stars/hash::hash          | hash: string                    | { hash: string, height: number, body: { address: string, status: { ra: string, dec: string, story: string, decodedStory: string }}, time: timestamp, previousBlockHash: string }   |
| GET /block/:height          | height: number                    | { hash: string, height: number, body: { address: string, status: { ra: string, dec: string, story: string, decodedStory: string }}, time: timestamp, previousBlockHash: string }   |
| POST /requestValidation          | body (JSON): { address: string }                    | { address: string, requestTimeStamp: number, message: string, validationWindow: timestamp }   |
| POST /message-signature/validate          | body (JSON): { address: string, signature: string }                    | { registerStar: bool, status: { address: string, requestTimeStamp: number, message: string, validationWindow: timestamp, messageSignature: bool }}   |

### example curl commands, adjust accordingly.

```bash
# GET /block/validate/1 - Validate the block at height 1
curl "http://localhost:8000/block/validate/1"
# GET /block/validate_all - Validate the whole blockchain
curl "http://localhost:8000/block/validate_all"
# GET /block/height - Get the blockchain height
curl "http://localhost:8000/block/height"
# GET /block/all - Get the whole blockchain
curl "http://localhost:8000/block/all"
# POST /requestValidation
curl -X "POST" "http://localhost:8000/requestValidation/" -H 'Content-Type: application/json; charset=utf-8' -d $'{"address":"142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ"}'
# POST /message-signature/validate
curl -X "POST" "http://localhost:8000/message-signature/validate/" -H 'Content-Type: application/json; charset=utf-8' -d $'{"address":"142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ", "signature": "H6ZrGrF0Y4rMGBMRT2+hHWGbThTIyhBS0dNKQRov9Yg6GgXcHxtO9GJN4nwD2yNXpnXHTWU9i+qdw5vpsooryLU="}'
# POST /block
curl -X "POST" "http://localhost:8000/block/" -H 'Content-Type: application/json; charset=utf-8' -d $'{"address":"142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ", "star": { "dec": "-26° 29 24.9", "ra": "16h 29m 1.0s", "story": "Found star using https://www.google.com/sky/"}}'
# GET /block/1
curl "http://localhost:8000/block/1"
# GET /stars/address::address
curl "http://localhost:8000/stars/address:142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ"
# GET /stars/hash::hash
curl "http://localhost:8000/stars/hash:a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f"
```
