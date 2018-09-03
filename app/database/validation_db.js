const db = require('./connect').connectValidation();

async function saveRequest(validationRequest) {
  return new Promise((resolve, reject) => {
    db.put(validationRequest.address, JSON.stringify(validationRequest))
      .then(() => resolve({ ok: true }))
      .catch(err => reject(err));
  });
}

async function saveUpdatedRequest(validationRequest) {
  return new Promise((resolve, reject) => {
    db.put(validationRequest.status.address, JSON.stringify(validationRequest))
      .then(() => resolve({ ok: true }))
      .catch(err => reject(err));
  });
}

async function getRequest(address) {
  return new Promise((resolve, reject) => {
    db.get(address)
      .then((request) => resolve(JSON.parse(request)))
      .catch(err => reject(err));
  });
}

async function deleteRequest(address) {
  return new Promise((resolve, reject) => {
    db.del(address)
      .then(() => resolve({ ok: true }))
      .catch(err => reject(err));
  });
}

module.exports = {
  saveRequest,
  getRequest,
  deleteRequest,
  saveUpdatedRequest
};
