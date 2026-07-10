import { usePortal } from '../../hooks/usePortal';
import Step6Scrutiny from './Step6Scrutiny';
import Step6FinalPayment from './Step6FinalPayment';
import Step6Receipt from './Step6Receipt';

export default function Step6() {
  const { state } = usePortal();
  if (state.step6Phase === 'review') return <Step6Scrutiny />;
  if (state.step6Phase === 'payment') return <Step6FinalPayment />;
  return <Step6Receipt />;
}
