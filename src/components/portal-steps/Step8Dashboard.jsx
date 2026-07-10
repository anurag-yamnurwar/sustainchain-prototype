import { usePortal } from '../../hooks/usePortal';
import { usePortalActions } from '../../hooks/usePortalActions';
import { useActiveVendor } from '../../hooks/useActiveVendor';
import ChartCanvas from '../common/ChartCanvas';
import VendorRegistryTable from '../common/VendorRegistryTable';

export default function Step8Dashboard() {
  const { state } = usePortal();
  const { resetPortal } = usePortalActions();
  const vendor = useActiveVendor();

  const scoredVendors = state.vendors.filter((v) => v.scores.overallAvg > 0);
  const fleetAverage = scoredVendors.length
    ? Math.round((scoredVendors.reduce((sum, v) => sum + v.scores.overallAvg, 0) / scoredVendors.length) * 100) / 100
    : 0;

  const barConfig = {
    type: 'bar',
    data: {
      labels: ['Registry Avg (0-4)', vendor?.name ?? 'Vendor'],
      datasets: [
        {
          label: 'ESG Overall Score',
          data: [fleetAverage, vendor?.scores.overallAvg ?? 0],
          backgroundColor: '#10b981',
          borderRadius: 20,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true, max: 4 } },
    },
  };

  return (
    <section className="animate-fade">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 pb-8 border-b border-stone-100">
        <div>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Ecosystem Dashboard</h3>
          <p className="text-stone-400 font-bold uppercase text-[11px] tracking-[0.2em] mt-3">
            Current Status Across All Vendors
          </p>
        </div>
        <button
          onClick={resetPortal}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-lg transition hover:bg-black"
        >
          + New Onboarding
        </button>
      </div>

      <VendorRegistryTable />

      {vendor && (
        <div className="mt-10 bg-white p-8 rounded-[2.5rem] border border-stone-200">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">
            {vendor.name} vs. Registry Average
          </p>
          <div className="h-52">
            <ChartCanvas config={barConfig} />
          </div>
        </div>
      )}
    </section>
  );
}
