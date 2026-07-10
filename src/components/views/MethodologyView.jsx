import { usePortalActions } from '../../hooks/usePortalActions';

export default function MethodologyView() {
  const { launchPortal } = usePortalActions();

  return (
    <div id="view-methodology" className="app-view pt-32 px-6">
      <div className="max-w-4xl mx-auto pb-32">
        <h2 className="text-5xl font-black text-slate-900 mb-10 tracking-tight text-center">Process Integrity</h2>
        <div className="prose prose-slate max-w-none text-lg text-slate-600 space-y-10 leading-relaxed font-medium">
          <div className="bg-emerald-900 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800 rounded-full -mr-16 -mt-16 opacity-50" />
            <h4 className="text-emerald-400 font-black uppercase text-xs tracking-widest mb-6">Core Methodology</h4>
            <p className="text-2xl font-medium leading-relaxed italic">
              "Our automated vetting ensures that only compliant industrial partners enter the ecosystem,
              drastically reducing the cost of ethics auditing."
            </p>
          </div>
          <div className="mt-10 flex justify-center">
            <button
              onClick={launchPortal}
              className="bg-emerald-600 text-white px-16 py-6 rounded-3xl font-black text-xl hover:bg-emerald-700 shadow-2xl transition transform hover:scale-105"
            >
              Access Hub Control &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
