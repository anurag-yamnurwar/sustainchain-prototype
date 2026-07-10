import { useState } from 'react';
import { usePortal } from '../../hooks/usePortal';
import { usePortalActions } from '../../hooks/usePortalActions';

const navLinks = [
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'team', label: 'Team' },
  { key: 'overview', label: 'Overview' },
];

export default function Navbar() {
  const { state } = usePortal();
  const { showView, launchPortal } = usePortalActions();
  const [menuOpen, setMenuOpen] = useState(false);

  if (state.view === 'portal') return null;

  const goTo = (view) => {
    showView(view);
    setMenuOpen(false);
  };

  const handleLaunchPortal = () => {
    launchPortal();
    setMenuOpen(false);
  };

  return (
    <nav id="main-nav" className="fixed top-0 w-full z-[100] glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex justify-between items-center">
        {/* Brand + parent company mark */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div
            className="flex items-center space-x-2 cursor-pointer min-w-0"
            onClick={() => goTo('home')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl sm:text-2xl shadow-lg shadow-emerald-200">
              S
            </div>
            <span className="text-base sm:text-xl font-extrabold tracking-tighter text-slate-900 uppercase truncate">
              SustainChain Suite<span className="text-emerald-500">.</span>
            </span>
          </div>

          {/* Parent company badge — reserved space for the Perpetual Solutions
              logo. Swap /assets/perpetual-logo.png for the current parent
              company mark whenever it changes; no code change needed. */}
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-stone-200 flex-shrink-0">
            <img
              src="/assets/perpetual-logo.png"
              alt="Perpetual Solutions"
              className="h-6 w-auto object-contain"
            />
            <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest leading-tight">
              A Perpetual<br />Solutions Company
            </span>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center space-x-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
          {navLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => goTo(link.key)}
              className={`hover:text-emerald-600 transition ${
                state.view === link.key ? 'text-emerald-600' : ''
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => goTo('admin')}
            title="Admin Settings"
            className={`text-slate-300 hover:text-slate-600 transition ${state.view === 'admin' ? 'text-slate-600' : ''}`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </button>
          <button
            onClick={handleLaunchPortal}
            className="bg-emerald-600 text-white px-8 py-3 rounded-full hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition transform hover:scale-105"
          >
            Vendor Portal
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="lg:hidden flex items-center justify-center w-11 h-11 rounded-2xl border border-stone-200 text-slate-700 flex-shrink-0"
        >
          {menuOpen ? (
            <span className="text-2xl leading-none">&times;</span>
          ) : (
            <span className="flex flex-col gap-[5px]">
              <span className="w-5 h-[2px] bg-slate-700 rounded-full" />
              <span className="w-5 h-[2px] bg-slate-700 rounded-full" />
              <span className="w-5 h-[2px] bg-slate-700 rounded-full" />
            </span>
          )}
        </button>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-100 px-6 py-6 space-y-1 shadow-xl animate-fade">
          {navLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => goTo(link.key)}
              className={`w-full text-left py-3 text-sm font-bold uppercase tracking-widest transition ${
                state.view === link.key ? 'text-emerald-600' : 'text-slate-600'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={handleLaunchPortal}
            className="w-full mt-4 bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-emerald-700 transition"
          >
            Vendor Portal
          </button>
          <button
            onClick={() => goTo('admin')}
            className="w-full mt-2 py-3 text-[11px] font-bold uppercase tracking-widest text-stone-400"
          >
            Admin Settings
          </button>

          <div className="flex items-center gap-2 pt-6 mt-4 border-t border-stone-100">
            <img
              src="/assets/perpetual-logo.png"
              alt="Perpetual Solutions"
              className="h-6 w-auto object-contain"
            />
            <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
              A Perpetual Solutions Company
            </span>
          </div>
        </div>
      )}
    </nav>
  );
}
