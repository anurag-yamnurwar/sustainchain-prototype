import { ACTIONS } from './actionTypes';

/** Returns a new vendor object with `status` updated and a history entry appended. */
function withLifecycleStatus(vendor, status) {
  return {
    ...vendor,
    status,
    history: [...vendor.history, { status, time: new Date().toLocaleString() }],
  };
}

/** Replaces the currently-active vendor with the result of updater(vendor). */
function updateActiveVendor(state, updater) {
  if (state.activeVendorIndex === null) return state.vendors;
  return state.vendors.map((v, i) => (i === state.activeVendorIndex ? updater(v) : v));
}

export function portalReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SHOW_VIEW:
      return { ...state, view: action.view };

    case ACTIONS.LAUNCH_PORTAL:
      return { ...state, view: 'portal' };

    case ACTIONS.RESET_PORTAL:
      return {
        ...state,
        activeVendorIndex: null,
        currentStep: 1,
        step1Phase: 'form',
        step6Phase: 'review',
      };

    case ACTIONS.GO_BACK_STEP:
      return { ...state, currentStep: Math.max(1, state.currentStep - 1) };

    case ACTIONS.ADVANCE_STEP:
      return { ...state, currentStep: action.step };

    case ACTIONS.REGISTER_VENDOR: {
      const v = action.vendor;
      const newVendor = withLifecycleStatus(
        {
          id: v.id,
          applicationId: v.applicationId,
          name: v.name,
          cr: v.cr,
          gst: v.gst,
          address: v.address,
          email: v.email,
          mobile: v.mobile,
          landline: v.landline ?? '',
          bank: v.bank,
          products: v.products,
          services: v.services,
          productBrochure: v.productBrochure,
          serviceBrochure: v.serviceBrochure ?? null,
          payment_status: 'Pending',
          payment_method: null,
          payment_txn_id: null,
          final_payment_status: 'Pending',
          final_payment_method: null,
          final_payment_txn_id: null,
          tier: null, // { key, label, tier }
          answers: {}, // questionnaire responses, keyed by question id
          questionnaireStatus: 'pending', // 'pending' | 'submitted' | 'info_requested' | 'accepted'
          infoRequests: [], // procurement's "please clarify" messages
          clarifications: [], // vendor's resubmission notes
          scores: { env: 0, soc: 0, gov: 0, aggregate: 0, overallAvg: 0, topicScores: {}, passed: null },
          clarificationRequests: [],
          status: 'Registered',
          history: [],
        },
        'Registration Committed'
      );
      return {
        ...state,
        vendors: [...state.vendors, newVendor],
        activeVendorIndex: state.vendors.length,
        step1Phase: 'payment',
      };
    }

    case ACTIONS.BACK_TO_REG_VIEW:
      return { ...state, step1Phase: 'form' };

    case ACTIONS.SWITCH_VENDOR:
      return { ...state, activeVendorIndex: action.index, currentStep: 1, step1Phase: 'form', step6Phase: 'review' };

    case ACTIONS.SET_PAY_METHOD:
      return { ...state, payMethod: action.method };

    case ACTIONS.AUTHORIZE_PAYMENT: {
      const vendors = updateActiveVendor(state, (v) =>
        withLifecycleStatus(
          { ...v, payment_status: 'Paid', payment_method: action.method.toUpperCase(), payment_txn_id: action.txnId },
          'Application Fee Paid'
        )
      );
      return { ...state, vendors, step1Phase: 'receipt' };
    }

    case ACTIONS.ACK_PAYMENT_RECEIPT:
      return { ...state, step1Phase: 'form', currentStep: 2 };

    case ACTIONS.SET_TIER: {
      const vendors = updateActiveVendor(state, (v) =>
        withLifecycleStatus({ ...v, tier: { key: action.key, label: action.label, tier: action.tier } }, 'Risk Tier Assigned')
      );
      return { ...state, vendors };
    }

    case ACTIONS.SUBMIT_QUESTIONNAIRE: {
      const vendors = updateActiveVendor(state, (v) =>
        withLifecycleStatus(
          { ...v, answers: { ...v.answers, ...action.answers }, questionnaireStatus: 'submitted' },
          'Questionnaire Submitted'
        )
      );
      return { ...state, vendors, currentStep: 4 };
    }

    case ACTIONS.REQUEST_ADDITIONAL_INFO: {
      const vendors = updateActiveVendor(state, (v) =>
        withLifecycleStatus(
          {
            ...v,
            questionnaireStatus: 'info_requested',
            infoRequests: [...v.infoRequests, { message: action.message, time: new Date().toLocaleString() }],
          },
          'Additional Info Requested'
        )
      );
      return { ...state, vendors, currentStep: 3 };
    }

    case ACTIONS.RESUBMIT_ANSWERS: {
      const vendors = updateActiveVendor(state, (v) =>
        withLifecycleStatus(
          {
            ...v,
            answers: { ...v.answers, ...action.answers },
            questionnaireStatus: 'submitted',
            clarifications: [...v.clarifications, { msg: action.note || 'Updated responses submitted.', time: new Date().toLocaleString() }],
          },
          'Additional Info Submitted'
        )
      );
      return { ...state, vendors, currentStep: 4 };
    }

    case ACTIONS.ACCEPT_QUESTIONNAIRE: {
      const vendors = updateActiveVendor(state, (v) => withLifecycleStatus({ ...v, questionnaireStatus: 'accepted' }, 'Questionnaire Accepted'));
      return { ...state, vendors, currentStep: 5 };
    }

    case ACTIONS.SET_SCORES: {
      const vendors = updateActiveVendor(state, (v) => withLifecycleStatus({ ...v, scores: action.scores }, 'ESG Scoring Complete'));
      return { ...state, vendors };
    }

    case ACTIONS.DECLINE_APPLICATION: {
      const vendors = updateActiveVendor(state, (v) => withLifecycleStatus(v, 'Manual Rejection Staged'));
      return { ...state, vendors };
    }

    // ESG scrutiny passed - vendor is NOT fully approved yet. They still
    // owe the final registration fee before joining the Approved Vendor
    // List (see Step6FinalPayment.jsx).
    case ACTIONS.APPROVE_VENDOR: {
      const vendors = updateActiveVendor(state, (v) => withLifecycleStatus(v, 'Pending Final Registration Fee'));
      return { ...state, vendors, step6Phase: 'payment' };
    }

    case ACTIONS.REJECT_LOW_SCORE: {
      const vendors = updateActiveVendor(state, (v) =>
        withLifecycleStatus(v, 'Rejected - Insufficient ESG Rating')
      );
      return { ...state, vendors };
    }

    case ACTIONS.AUTHORIZE_FINAL_PAYMENT: {
      const vendors = updateActiveVendor(state, (v) =>
        withLifecycleStatus(
          {
            ...v,
            final_payment_status: 'Paid',
            final_payment_method: action.method.toUpperCase(),
            final_payment_txn_id: action.txnId,
          },
          'Approved Vendor'
        )
      );
      return { ...state, vendors, step6Phase: 'receipt' };
    }

    case ACTIONS.ACK_FINAL_RECEIPT:
      return { ...state, step6Phase: 'review', currentStep: 7 };

    // Admin bypass — for vendors who can't be pushed through the normal
    // flow (e.g. a utility board that dictates terms rather than filling
    // out a form). Marks the vendor fully Approved regardless of current
    // stage, skipping payment/scoring gates.
    case ACTIONS.ADMIN_FORCE_APPROVE: {
      const vendors = state.vendors.map((v, i) =>
        i === action.index
          ? withLifecycleStatus(
              { ...v, payment_status: 'Waived (Admin)', final_payment_status: 'Waived (Admin)' },
              'Approved Vendor (Admin Override)'
            )
          : v
      );
      return { ...state, vendors };
    }

    case ACTIONS.DELETE_VENDOR: {
      const vendors = state.vendors.filter((_, i) => i !== action.index);
      let activeVendorIndex = state.activeVendorIndex;
      if (activeVendorIndex === action.index) activeVendorIndex = null;
      else if (activeVendorIndex !== null && activeVendorIndex > action.index) activeVendorIndex -= 1;
      return { ...state, vendors, activeVendorIndex };
    }

    case ACTIONS.SHOW_TOAST:
      return { ...state, toast: { visible: true, text: action.text, isError: !!action.isError } };

    case ACTIONS.HIDE_TOAST:
      return { ...state, toast: { ...state.toast, visible: false } };

    default:
      return state;
  }
}
