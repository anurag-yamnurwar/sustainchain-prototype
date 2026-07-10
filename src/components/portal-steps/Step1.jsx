import { usePortal } from '../../hooks/usePortal';
import Step1Identity from './Step1Identity';
import Step1Payment from './Step1Payment';
import Step1Receipt from './Step1Receipt';

export default function Step1() {
  const { state } = usePortal();
  if (state.step1Phase === 'form') return <Step1Identity />;
  if (state.step1Phase === 'payment') return <Step1Payment />;
  return <Step1Receipt />;
}
