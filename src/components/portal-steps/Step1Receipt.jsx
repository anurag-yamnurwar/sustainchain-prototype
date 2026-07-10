import { usePortalActions } from '../../hooks/usePortalActions';
import { useActiveVendor } from '../../hooks/useActiveVendor';
import PaymentReceipt from '../common/PaymentReceipt';

export default function Step1Receipt() {
  const { ackPaymentReceipt } = usePortalActions();
  const vendor = useActiveVendor();

  return (
    <PaymentReceipt
      title="Application Submitted"
      subtitle="Your registration fee has been received. You're now in the review queue."
      amount="100"
      txnId={vendor?.payment_txn_id}
      method={vendor?.payment_method}
      vendor={vendor}
      applicationId={vendor?.applicationId}
      onContinue={ackPaymentReceipt}
      continueLabel="Continue to Classification"
    />
  );
}
