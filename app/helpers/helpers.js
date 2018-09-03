// Create timestamp (seconds)
function generateTimestamp() {
  return new Date().getTime().toString().slice(0, -3);
}

module.exports = {
  generateTimestamp
};
