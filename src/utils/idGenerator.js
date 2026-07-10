export function generateVendorId() {
  return 'V-' + Math.floor(Math.random() * 9000 + 1000);
}

/** Generates a realistic-looking payment transaction reference. */
export function generateTxnId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `TXN-${stamp}-${rand}`;
}

/** Generates an application ID shown on the receipt / status tracking. */
export function generateApplicationId() {
  const year = new Date().getFullYear();
  const seq = Math.floor(Math.random() * 90000 + 10000);
  return `SC-${year}-${seq}`;
}
