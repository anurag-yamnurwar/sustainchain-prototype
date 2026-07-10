import QRCode from 'qrcode';

/**
 * Builds a standard UPI deep-link payment string and renders it as a QR
 * code data URL. This is a genuinely valid UPI intent URI (the same
 * format PhonePe/GPay/Paytm scan) — scanning it will open a real UPI
 * app's payment screen. It won't complete a transaction until this is
 * pointed at a real, verified payee VPA, which requires a live payment
 * gateway account — see the note in Step1Payment.jsx.
 *
 * @param {{ payeeVpa: string, payeeName: string, amount: number, note: string, txnRef: string }} params
 * @returns {Promise<string>} PNG data URL
 */
export async function generateUpiQr({ payeeVpa, payeeName, amount, note, txnRef }) {
  const params = new URLSearchParams({
    pa: payeeVpa,
    pn: payeeName,
    am: String(amount),
    cu: 'INR',
    tn: note,
    tr: txnRef ?? '',
  });
  const upiUri = `upi://pay?${params.toString()}`;

  return QRCode.toDataURL(upiUri, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 240,
    color: { dark: '#0f172a', light: '#ffffff' },
  });
}
