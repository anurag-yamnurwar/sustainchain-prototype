import { useEffect, useState } from 'react';
import { generateUpiQr } from '../../utils/upiQr';

// Placeholder payee VPA — swap for the real business UPI ID once a
// payment gateway account is set up. See Step1Payment.jsx for the full
// note on why this can't be wired to move real money from the frontend
// alone.
const PAYEE_VPA = 'sustainchain.demo@upi';
const PAYEE_NAME = 'SustainChain Suite';

export default function UpiQrCode({ amount, note, txnRef }) {
  const [qrDataUrl, setQrDataUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;
    generateUpiQr({ payeeVpa: PAYEE_VPA, payeeName: PAYEE_NAME, amount, note, txnRef }).then((url) => {
      if (!cancelled) setQrDataUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [amount, note, txnRef]);

  return (
    <div className="flex flex-col items-center gap-3 p-6 bg-white border border-slate-200 rounded-3xl">
      {qrDataUrl ? (
        <img src={qrDataUrl} alt="UPI payment QR code" className="w-40 h-40 sm:w-48 sm:h-48" />
      ) : (
        <div className="w-40 h-40 sm:w-48 sm:h-48 bg-slate-100 rounded-2xl animate-pulse" />
      )}
      <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Scan to Pay &#8377;{amount}</p>
      <p className="text-[10px] text-slate-400 font-mono">{PAYEE_VPA}</p>
    </div>
  );
}
