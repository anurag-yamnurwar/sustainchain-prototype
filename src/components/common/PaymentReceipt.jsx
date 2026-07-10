export default function PaymentReceipt({ title, subtitle, amount, txnId, method, vendor, applicationId, onContinue, continueLabel }) {
  return (
    <div className="max-w-xl mx-auto py-10 animate-fade text-center">
      <div className="w-20 h-20 mx-auto mb-8 bg-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-emerald-100">
        <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{title}</h3>
      <p className="text-slate-500 font-medium mb-10">{subtitle}</p>

      <div className="bg-stone-50 border border-stone-100 rounded-[2rem] p-8 text-left space-y-4">
        <ReceiptRow label="Amount Paid" value={`\u20B9 ${amount}`} emphasis />
        <ReceiptRow label="Payment Method" value={method} />
        <ReceiptRow label="Transaction ID" value={txnId} mono />
        {applicationId && <ReceiptRow label="Application ID" value={applicationId} mono />}
        {vendor && <ReceiptRow label="Vendor" value={`${vendor.name} (${vendor.id})`} />}
        <ReceiptRow label="Timestamp" value={new Date().toLocaleString()} />
      </div>

      <button
        onClick={onContinue}
        className="w-full mt-8 py-5 bg-emerald-600 text-white font-black text-lg rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all transform hover:scale-[1.01]"
      >
        {continueLabel}
      </button>
    </div>
  );
}

function ReceiptRow({ label, value, mono, emphasis }) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      <span
        className={`text-right truncate ${mono ? 'font-mono text-xs' : ''} ${
          emphasis ? 'text-xl font-black text-slate-900' : 'text-sm font-bold text-slate-700'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
