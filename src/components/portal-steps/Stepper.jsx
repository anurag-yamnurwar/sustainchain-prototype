import { usePortal } from '../../hooks/usePortal';
import { stepLabels } from '../../data/stepLabels';

export default function Stepper() {
  const { state } = usePortal();

  return (
    <div className="overflow-x-auto pb-4 scrollbar-hide">
      <div id="stepper-track" className="flex justify-between items-center min-w-[1000px]">
        {stepLabels.map((label, i) => {
          const stepNumber = i + 1;
          const active = stepNumber === state.currentStep;
          const done = stepNumber < state.currentStep;
          return (
            <div key={label} className="flex flex-col items-center flex-1 relative">
              <div
                className={`stepper-circle w-16 h-16 rounded-[1.8rem] flex items-center justify-center font-black text-base z-10 mb-4 bg-white text-stone-300 border-2 border-stone-100 shadow-sm transition-all duration-700 ${
                  active ? 'stepper-active' : done ? 'stepper-complete' : ''
                }`}
              >
                {done ? '\u2713' : stepNumber}
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-[0.2em] text-center ${
                  active ? 'text-emerald-700' : 'text-stone-300'
                }`}
              >
                {label}
              </span>
              {i < stepLabels.length - 1 && (
                <div className="absolute top-8 left-[60%] w-full h-[1px] bg-stone-100 -z-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
