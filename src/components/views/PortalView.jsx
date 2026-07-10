import { usePortal } from '../../hooks/usePortal';
import { usePortalActions } from '../../hooks/usePortalActions';
import { useActiveVendor } from '../../hooks/useActiveVendor';
import Stepper from '../portal-steps/Stepper';
import VendorSwitcher from '../portal-steps/VendorSwitcher';
import Toast from '../layout/Toast';
import Step1 from '../portal-steps/Step1';
import Step2Classification from '../portal-steps/Step2Classification';
import Step3Audit from '../portal-steps/Step3Audit';
import Step4Review from '../portal-steps/Step4Review';
import Step5Scoring from '../portal-steps/Step5Scoring';
import Step6 from '../portal-steps/Step6';
import Step7ErpSync from '../portal-steps/Step7ErpSync';
import Step8Dashboard from '../portal-steps/Step8Dashboard';

const stepComponents = {
  1: Step1,
  2: Step2Classification,
  3: Step3Audit,
  4: Step4Review,
  5: Step5Scoring,
  6: Step6,
  7: Step7ErpSync,
  8: Step8Dashboard,
};

export default function PortalView() {
  const { state } = usePortal();
  const { showView, goBackStep, resetPortal } = usePortalActions();
  const vendor = useActiveVendor();

  const ActiveStep = stepComponents[state.currentStep];

  return (
    <div id="view-portal" className="app-view active pt-24 min-h-screen bg-stone-100 pb-32">
      <div className="max-w-7xl mx-auto px-4">
        {/* App Shell Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8 px-4">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-900">Enterprise Registry</h2>
            <div className="flex items-center space-x-3">
              <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-200" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Multi-Vendor Control Active</span>
            </div>
          </div>
          <div className="flex space-x-4 items-center">
            <VendorSwitcher />
            <div className="bg-white border border-stone-200 px-8 py-3 rounded-full text-[10px] font-black text-stone-500 uppercase tracking-widest shadow-sm">
              Lifecycle: <span className="text-emerald-600">{vendor?.status ?? 'Pending Initiation'}</span>
            </div>
            <button onClick={() => showView('home')} className="text-slate-400 hover:text-red-500 transition font-black text-2xl px-2">
              &times;
            </button>
          </div>
        </div>

        {/* Back Control & Stepper */}
        <div className="flex flex-col space-y-6 mb-14 px-4">
          <div className="flex justify-between items-center">
            <button onClick={goBackStep} className="text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest flex items-center space-x-2 transition">
              <span>&larr; Previous Stage</span>
            </button>
            <button onClick={resetPortal} className="text-[10px] font-black text-stone-300 hover:text-red-500 uppercase tracking-widest transition">
              New Onboarding
            </button>
          </div>
          <Stepper />
        </div>

        {/* PORTAL WORKSPACE */}
        <div className="bg-white rounded-[4rem] p-10 md:p-16 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] border border-stone-200 relative min-h-[700px] overflow-hidden">
          <Toast />
          <ActiveStep />
        </div>
      </div>
    </div>
  );
}
