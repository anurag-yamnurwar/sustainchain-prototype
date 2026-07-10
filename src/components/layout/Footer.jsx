export default function Footer() {
  return (
    <footer className="bg-white pt-24 pb-12 px-6 border-t border-slate-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
        <div className="space-y-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
              E
            </div>
            <span className="text-xl font-black tracking-tighter">
              EcoProcure<span className="text-emerald-500">.</span>
            </span>
          </div>
          <p className="text-slate-500 leading-relaxed font-medium">
            The definitive standard for integrating ESG logic into industrial procurement workflows at scale.
          </p>
        </div>
        <div>
          <h5 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-8">Solutions</h5>
          <ul className="space-y-4 text-sm font-bold text-slate-600">
            <li>Onboarding automation</li>
            <li>ESG Scoring Engine</li>
            <li>ERP Master Sync</li>
          </ul>
        </div>
        <div>
          <h5 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-8">Industrial</h5>
          <ul className="space-y-4 text-sm font-bold text-slate-600">
            <li>Automotive</li>
            <li>Manufacturing</li>
            <li>Pharma Vetting</li>
          </ul>
        </div>
        <div>
          <h5 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-8">Legal</h5>
          <ul className="space-y-4 text-sm font-bold text-slate-600">
            <li>Privacy Framework</li>
            <li>Security Audit</li>
            <li>Terms of Operation</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-10 border-t border-slate-100 flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
        <div className="flex items-center gap-3">
          {/* Parent company mark — reserved space; swap the image whenever
              the parent company's logo changes, no other code to touch. */}
          <img
            src="/assets/perpetual-logo.png"
            alt="Perpetual Solutions"
            className="h-8 w-auto object-contain"
          />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            A Perpetual Solutions Company
          </span>
        </div>
        <div className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-center md:text-right">
          <p>&copy; 2026 SustainChain Suite. Industrial Suite. Enterprise Release v4.2.5</p>
          <p>Guy on Chair Anurag Yamnurwar</p>
        </div>
      </div>
    </footer>
  );
}
