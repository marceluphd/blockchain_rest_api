// Create timestamp (seconds)
export function generateTimestamp(): number {
  return parseInt(new Date().getTime().toString().slice(0, -3), 10);
}
