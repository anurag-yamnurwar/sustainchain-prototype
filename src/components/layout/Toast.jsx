import { usePortal } from '../../hooks/usePortal';
import { usePortalActions } from '../../hooks/usePortalActions';

export default function Toast() {
  const { state } = usePortal();
  const { hideToast } = usePortalActions();
  const { visible, text, isError } = state.toast;

  if (!visible) return null;

  return (
    <div className="absolute top-10 left-1/2 -translate-x-1/2 px-8 py-5 bg-slate-900 text-white rounded-3xl shadow-2xl z-[500] flex items-center space-x-6 animate-fade">
      {!isError && <div className="loader" />}
      <span className="text-sm font-black uppercase tracking-widest">{text}</span>
      <button onClick={hideToast} className="font-black text-emerald-400 text-lg">
        &times;
      </button>
    </div>
  );
}
