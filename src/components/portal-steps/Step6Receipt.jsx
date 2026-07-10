import { usePortalActions } from '../../hooks/usePortalActions';
import { useActiveVendor } from '../../hooks/useActiveVendor';
import PaymentReceipt from '../common/PaymentReceipt';

export default function Step6Receipt() {
  const { ackFinalReceipt } = usePortalActions();
  const vendor = useActiveVendor();

  return (
    <PaymentReceipt
      title="Vendor Approved"
      subtitle={`${vendor?.name ?? 'Vendor'} is now on the Approved Vendor List.`}
      amount="1,000"
      txnId={vendor?.final_payment_txn_id}
      method={vendor?.final_payment_method}
      vendor={vendor}
      applicationId={vendor?.applicationId}
      onContinue={ackFinalReceipt}
      continueLabel="Continue to ERP Sync"
    />
  );
}
