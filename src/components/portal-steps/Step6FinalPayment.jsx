import { useState } from 'react';
import { usePortal } from '../../hooks/usePortal';
import { usePortalActions } from '../../hooks/usePortalActions';
import { useActiveVendor } from '../../hooks/useActiveVendor';
import UpiQrCode from '../common/UpiQrCode';

const FINAL_FEE = 1000;

export default function Step6FinalPayment() {
  const { state } = usePortal();
  const { authorizeFinalPayment } = usePortalActions();
  const vendor = useActiveVendor();
  const [authorizing, setAuthorizing] = useState(false);

  const handleAuthorize = () => authorizeFinalPayment(state.payMethod, () => setAuthorizing(true));

  return (
    <div className="max-w-xl mx-auto py-10 animate-fade text-center">
      <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100">
        ESG Scrutiny Passed
      </div>
      <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Final Registration Fee</h3>
      <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto leading-relaxed">
        {vendor?.name} has cleared ESG scrutiny. One last step — the final registration fee completes entry
        onto the Approved Vendor List.
      </p>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-lg space-y-6">
        <p className="text-5xl font-black text-slate-900">₹ {FINAL_FEE}<span className="text-lg text-slate-400 font-bold">.00</span></p>

        <div className="flex justify-center">
          <UpiQrCode amount={FINAL_FEE} note="SustainChain Final Registration Fee" txnRef={vendor?.id ?? 'PENDING'} />
        </div>

        <button
          type="button"
          onClick={handleAuthorize}
          disabled={authorizing}
          className="w-full py-5 bg-emerald-600 text-white font-black text-lg rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all transform hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
        >
          {authorizing ? (
            <>
              <div className="loader" />
              <span>Processing Payment...</span>
            </>
          ) : (
            <span>Pay ₹ {FINAL_FEE} & Complete Approval</span>
          )}
        </button>
      </div>

      <p className="text-[11px] text-slate-400 mt-5 font-medium">
        This is the ₹1,000 final registration payment — distinct from the ₹100 application fee paid in Step 1.
      </p>
    </div>
  );
}
