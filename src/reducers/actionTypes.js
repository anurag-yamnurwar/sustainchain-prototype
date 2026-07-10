// Every state transition the app supports. Named constants so a typo
// is a build/IDE error rather than a silent runtime bug.
export const ACTIONS = {
  SHOW_VIEW: 'SHOW_VIEW',
  LAUNCH_PORTAL: 'LAUNCH_PORTAL',
  RESET_PORTAL: 'RESET_PORTAL',

  GO_BACK_STEP: 'GO_BACK_STEP',
  ADVANCE_STEP: 'ADVANCE_STEP',

  // ADD_PRODUCT / ADD_SERVICE / SET_BROCHURE removed:
  // product, service, and brochure data is managed as local state inside
  // Step1Identity.jsx and passed in bulk via REGISTER_VENDOR on submit.

  REGISTER_VENDOR: 'REGISTER_VENDOR',
  BACK_TO_REG_VIEW: 'BACK_TO_REG_VIEW', // payment → form back navigation
  SWITCH_VENDOR: 'SWITCH_VENDOR',

  SET_PAY_METHOD: 'SET_PAY_METHOD',
  AUTHORIZE_PAYMENT: 'AUTHORIZE_PAYMENT',
  ACK_PAYMENT_RECEIPT: 'ACK_PAYMENT_RECEIPT', // receipt screen → continue

  SET_TIER: 'SET_TIER',
  SUBMIT_QUESTIONNAIRE: 'SUBMIT_QUESTIONNAIRE',
  REQUEST_ADDITIONAL_INFO: 'REQUEST_ADDITIONAL_INFO',
  RESUBMIT_ANSWERS: 'RESUBMIT_ANSWERS',
  ACCEPT_QUESTIONNAIRE: 'ACCEPT_QUESTIONNAIRE',
  SET_SCORES: 'SET_SCORES',

  ADD_CLARIFICATION: 'ADD_CLARIFICATION',

  DECLINE_APPLICATION: 'DECLINE_APPLICATION',
  APPROVE_VENDOR: 'APPROVE_VENDOR', // scrutiny passed → gates into final payment
  REJECT_LOW_SCORE: 'REJECT_LOW_SCORE',

  AUTHORIZE_FINAL_PAYMENT: 'AUTHORIZE_FINAL_PAYMENT', // final registration fee
  ACK_FINAL_RECEIPT: 'ACK_FINAL_RECEIPT', // final receipt screen → advance to ERP sync

  // Admin-level controls — for vendors that can't go through the normal
  // flow (e.g. a utility board that won't fill out a vendor form) or that
  // need to be removed from the registry entirely.
  ADMIN_FORCE_APPROVE: 'ADMIN_FORCE_APPROVE',
  DELETE_VENDOR: 'DELETE_VENDOR',

  SHOW_TOAST: 'SHOW_TOAST',
  HIDE_TOAST: 'HIDE_TOAST',
};
