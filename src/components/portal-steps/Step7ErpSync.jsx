import { usePortalActions } from '../../hooks/usePortalActions';
import { useActiveVendor } from '../../hooks/useActiveVendor';
import { exportVendorMasterData } from '../../utils/erpExport';

export default function Step7ErpSync() {
  const { advanceToStep8 } = usePortalActions();
  const vendor = useActiveVendor();

  const handleExport = () => {
    if (!vendor) return;
    exportVendorMasterData(vendor, vendor.tier, vendor.scores);
    advanceToStep8();
  };

  return (
    <section className="text-center py-24 animate-fade">
      <div className="bg-emerald-900 p-24 rounded-[6rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-800 rounded-full opacity-40" />
        <h3 className="text-6xl font-black mb-8 tracking-tighter">Master Packet Ready</h3>
        <p className="text-emerald-400 mb-16 max-w-2xl mx-auto text-2xl font-medium">
          Qualify vendor data and download the serialized Master Package for instant SAP/Oracle ingestion.
        </p>
        <button
          onClick={handleExport}
          className="bg-white text-emerald-900 px-20 py-10 rounded-[3rem] font-black text-3xl shadow-2xl hover:scale-110 transition transform flex items-center space-x-8 mx-auto group"
        >
          <span className="group-hover:rotate-12 transition">{'\u{1F4BE}'}</span>
          <span>Download ERP_Master.xlsx</span>
        </button>
      </div>
    </section>
  );
}
