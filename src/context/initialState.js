import { loadVendorRegistry } from '../utils/storage';

const persisted = loadVendorRegistry();

export const initialPortalState = {
  // Top-level view: 'home' | 'about' | 'team' | 'overview' | 'methodology' | 'portal'
  view: 'home',

  // Multi-step portal progress (1-8, see src/data/stepLabels.js)
  currentStep: 1,

  // Step 1 has two sub-phases: filling the registration form, then payment.
  // All form field data is managed as local state inside Step1Identity.jsx
  // and committed to global state only on successful registration.
  step1Phase: 'form', // 'form' | 'payment' | 'receipt'

  // Step 6 (Scrutiny) similarly gates behind a final registration payment
  // before a vendor can proceed to ERP export — see Step6Scrutiny.jsx.
  step6Phase: 'review', // 'review' | 'payment' | 'receipt'

  // Restored from localStorage so registered vendors survive a page
  // refresh — see src/utils/storage.js. tier and scores live on each
  // vendor object (vendor.tier, vendor.scores), not here, so switching
  // between vendors shows the correct data for each one.
  vendors: persisted.vendors,
  activeVendorIndex: persisted.activeVendorIndex,

  payMethod: 'upi',

  toast: { visible: false, text: '', isError: false },
};
