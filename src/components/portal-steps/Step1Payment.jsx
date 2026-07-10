import { useState } from 'react';
import { usePortal } from '../../hooks/usePortal';
import { usePortalActions } from '../../hooks/usePortalActions';
import { useActiveVendor } from '../../hooks/useActiveVendor';
import UpiQrCode from '../common/UpiQrCode';

const APPLICATION_FEE = 100;

const PAY_TABS = [
  { id: 'upi', label: 'UPI', icon: '📲' },
  { id: 'card', label: 'Card', icon: '💳' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
];

export default function Step1Payment() {
  const { state } = usePortal();
  const { setPayMethod, authorizePayment, backToRegView } = usePortalActions();
  const vendor = useActiveVendor();
  const [authorizing, setAuthorizing] = useState(false);

  const handleAuthorize = () => authorizePayment(state.payMethod, () => setAuthorizing(true));

  return (
    <div className="max-w-2xl mx-auto py-6 animate-fade">

      {/* ── Vendor context banner ── */}
      {vendor && (
        <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl mb-7">
          <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-emerald-800 uppercase tracking-wide truncate">{vendor.name}</p>
            <p className="text-[11px] text-emerald-600 font-medium">Vendor ID: {vendor.id} · GST: {vendor.gst}</p>
          </div>
          <div className="ml-auto shrink-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-xl">
              Registered
            </span>
          </div>
        </div>
      )}

      {/* ── Payment card ── */}
      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-lg">

        {/* Header */}
        <div className="px-10 py-8 bg-gradient-to-r from-slate-900 to-slate-800 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Application Fee — Vendor Enquiry</p>
            <p className="text-5xl font-black text-white">₹ {APPLICATION_FEE}<span className="text-xl text-slate-400 font-bold">.00</span></p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <span className="text-[10px] font-black uppercase tracking-wider">Secured</span>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Nominal — Filters Junk Registrations</p>
            <p className="text-[10px] text-slate-600 font-bold uppercase">Non-Refundable</p>
          </div>
        </div>

        {/* Payment method tabs */}
        <div className="px-8 pt-8">
          <div className="flex bg-slate-100 rounded-2xl p-1.5 gap-1">
            {PAY_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPayMethod(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all ${
                  state.payMethod === tab.id
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Payment method panels */}
        <div className="px-8 py-7">
          {state.payMethod === 'upi' && (
            <div className="space-y-5 animate-fade">
              <div className="flex justify-center">
                <UpiQrCode amount={APPLICATION_FEE} note="SustainChain Application Fee" txnRef={vendor?.id ?? 'PENDING'} />
              </div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 text-center">
                or enter UPI ID manually
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="yourname@upi"
                  className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all placeholder:text-slate-300"
                />
                <button
                  type="button"
                  className="px-5 py-4 bg-slate-100 border border-slate-200 rounded-2xl text-[11px] font-black text-slate-500 uppercase tracking-wide hover:bg-slate-200 transition-colors whitespace-nowrap"
                >
                  Verify VPA
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
                <svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Supports PhonePe, GPay, Paytm, and all UPI apps
              </div>
            </div>
          )}

          {state.payMethod === 'card' && (
            <div className="space-y-4 animate-fade">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Card Number</label>
                <input
                  type="text"
                  defaultValue="4242 4242 4242 4242"
                  readOnly
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono font-bold text-slate-700 outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Expiry</label>
                  <input type="text" defaultValue="12/28" readOnly className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono font-bold text-slate-700 outline-none text-center" />
                </div>
                <div className="col-span-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">CVV</label>
                  <input type="password" defaultValue="123" readOnly className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono font-bold text-slate-700 outline-none text-center" />
                </div>
                <div className="col-span-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Network</label>
                  <div className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                    <span className="text-[11px] font-black text-blue-600 uppercase">VISA</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {state.payMethod === 'netbanking' && (
            <div className="space-y-4 animate-fade">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Select Your Bank</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak', 'Other'].map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    className="px-4 py-3.5 border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 bg-white hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 transition-all text-center"
                  >
                    {bank}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Authorize button */}
          <button
            type="button"
            onClick={handleAuthorize}
            disabled={authorizing}
            className="w-full mt-8 py-5 bg-emerald-600 text-white font-black text-lg rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all transform hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
          >
            {authorizing ? (
              <>
                <div className="loader" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <span>Authorize & Pay ₹ {APPLICATION_FEE}</span>
              </>
            )}
          </button>

          {/* Back link */}
          <div className="flex items-center justify-center gap-6 mt-5">
            <button
              type="button"
              onClick={backToRegView}
              className="text-[11px] font-bold text-slate-400 hover:text-slate-700 uppercase tracking-widest transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
              Back to Registration
            </button>
            <div className="text-slate-200">|</div>
            <p className="text-[11px] text-slate-400 font-medium">
              🔒 256-bit SSL Encrypted
            </p>
          </div>
        </div>
      </div>

      {/* Footnote */}
      <p className="text-center text-[11px] text-slate-400 mt-5 font-medium px-4">
        This nominal application fee filters out spam registrations. It's separate from the ₹1,000 final
        registration fee due after ESG scrutiny (Step 6). The QR code above encodes a genuine UPI payment
        request — wiring it to a live, verified payee account is the first backend milestone (see project notes).
      </p>
    </div>
  );
}
