import { useCallback } from 'react';
import { usePortal } from './usePortal';
import { ACTIONS } from '../reducers/actionTypes';
import { generateVendorId, generateTxnId, generateApplicationId } from '../utils/idGenerator';
import { calculateScores } from '../utils/scoring';
import { sendNotification } from '../utils/notifications';

export function usePortalActions() {
  const { state, dispatch } = usePortal();
  const activeVendor = state.activeVendorIndex !== null ? state.vendors[state.activeVendorIndex] : null;

  const showToast = useCallback(
    (text, isError = false) => {
      dispatch({ type: ACTIONS.SHOW_TOAST, text, isError });
      setTimeout(() => dispatch({ type: ACTIONS.HIDE_TOAST }), 5000);
    },
    [dispatch]
  );

  const hideToast = useCallback(() => dispatch({ type: ACTIONS.HIDE_TOAST }), [dispatch]);

  const simulateProcessing = useCallback(
    (targetStep) => {
      showToast('System Processing...');
      setTimeout(() => dispatch({ type: ACTIONS.ADVANCE_STEP, step: targetStep }), 800);
    },
    [dispatch, showToast]
  );

  const showView = useCallback((view) => dispatch({ type: ACTIONS.SHOW_VIEW, view }), [dispatch]);
  const launchPortal = useCallback(() => dispatch({ type: ACTIONS.LAUNCH_PORTAL }), [dispatch]);
  const goBackStep = useCallback(() => dispatch({ type: ACTIONS.GO_BACK_STEP }), [dispatch]);
  const resetPortal = useCallback(() => dispatch({ type: ACTIONS.RESET_PORTAL }), [dispatch]);

  /**
   * Validates business-logic rules (duplicate GST) and commits the vendor.
   * Per-field format validation is handled in Step1Identity.jsx before this is called.
   */
  const registerVendor = useCallback(
    (vendorData) => {
      const duplicate = state.vendors.find((v) => v.gst === vendorData.gst);
      if (duplicate) return 'A vendor with this GST number is already registered in the system.';

      dispatch({
        type: ACTIONS.REGISTER_VENDOR,
        vendor: {
          id: generateVendorId(),
          applicationId: generateApplicationId(),
          name: vendorData.vendorName,
          cr: vendorData.crNumber,
          gst: vendorData.gstNumber,
          address: vendorData.address,
          email: vendorData.email,
          mobile: vendorData.mobile,
          landline: vendorData.landline,
          bank: vendorData.bankDetails,
          products: vendorData.products,
          services: vendorData.services,
          productBrochure: vendorData.productBrochure,
          serviceBrochure: vendorData.serviceBrochure,
        },
      });
      return null;
    },
    [dispatch, state.vendors]
  );

  const backToRegView = useCallback(() => dispatch({ type: ACTIONS.BACK_TO_REG_VIEW }), [dispatch]);

  const switchVendor = useCallback(
    (index) => {
      dispatch({ type: ACTIONS.SWITCH_VENDOR, index });
      showToast(`Switched to: ${state.vendors[index].name}`);
    },
    [dispatch, showToast, state.vendors]
  );

  const setPayMethod = useCallback((method) => dispatch({ type: ACTIONS.SET_PAY_METHOD, method }), [dispatch]);

  /** Step 1's application-fee payment. Lands on a receipt screen rather than auto-advancing. */
  const authorizePayment = useCallback(
    (method, onStart) => {
      onStart?.();
      const txnId = generateTxnId();
      const vendorSnapshot = activeVendor;
      setTimeout(() => {
        dispatch({ type: ACTIONS.AUTHORIZE_PAYMENT, method, txnId });
        showToast('Payment Successful.');
        if (vendorSnapshot) {
          sendNotification('vendorRegistered', {
            vendorName: vendorSnapshot.name,
            applicationId: vendorSnapshot.applicationId,
            gst: vendorSnapshot.gst,
            productsServices: [...vendorSnapshot.products, ...vendorSnapshot.services].join(', '),
          });
        }
      }, 1200);
    },
    [dispatch, showToast, activeVendor]
  );

  /** Continue button on the application-fee receipt - moves into Step 2. */
  const ackPaymentReceipt = useCallback(() => dispatch({ type: ACTIONS.ACK_PAYMENT_RECEIPT }), [dispatch]);

  /** Step 2: classify the vendor and email them the applicable questionnaire link. */
  const setTier = useCallback(
    (key, label, tier) => {
      dispatch({ type: ACTIONS.SET_TIER, key, label, tier });
      if (activeVendor) {
        sendNotification('questionnaireAssigned', {
          vendorName: activeVendor.name,
          tierLabel: label,
          questionnaireLink: `https://portal.example.com/questionnaire/${activeVendor.id}`,
          esgContactEmail: 'esg@perpetualsolutions.example',
        });
      }
      simulateProcessing(3);
    },
    [dispatch, simulateProcessing, activeVendor]
  );

  /** Step 3: vendor submits (or re-submits) their ESG questionnaire answers. */
  const submitQuestionnaire = useCallback(
    (answers) => {
      dispatch({ type: ACTIONS.SUBMIT_QUESTIONNAIRE, answers });
      if (activeVendor) {
        sendNotification('questionnaireSubmitted', {
          vendorName: activeVendor.name,
          applicationId: activeVendor.applicationId,
          tierLabel: activeVendor.tier?.label ?? '—',
        });
      }
    },
    [dispatch, activeVendor]
  );

  /** Step 4: procurement requests more detail instead of accepting outright. */
  const requestAdditionalInfo = useCallback(
    (message) => {
      dispatch({ type: ACTIONS.REQUEST_ADDITIONAL_INFO, message });
      if (activeVendor) {
        sendNotification('additionalInfoRequested', {
          vendorName: activeVendor.name,
          applicationId: activeVendor.applicationId,
          requestMessage: message,
          questionnaireLink: `https://portal.example.com/questionnaire/${activeVendor.id}`,
        });
      }
    },
    [dispatch, activeVendor]
  );

  /** Step 4: vendor updates their answers in response to a request and resubmits. */
  const resubmitAnswers = useCallback(
    (answers, note) => {
      dispatch({ type: ACTIONS.RESUBMIT_ANSWERS, answers, note });
    },
    [dispatch]
  );

  /** Step 4: procurement accepts the questionnaire as complete -> advances to Step 5 (Scoring). */
  const acceptQuestionnaire = useCallback(() => {
    dispatch({ type: ACTIONS.ACCEPT_QUESTIONNAIRE });
  }, [dispatch]);

  /** Step 5: runs the real scoring engine against the vendor's tier + answers. Idempotent-ish - call once per view. */
  const computeScores = useCallback(() => {
    if (!activeVendor?.tier) return;
    const scores = calculateScores(activeVendor.tier.key, activeVendor.answers);
    dispatch({ type: ACTIONS.SET_SCORES, scores });
    sendNotification('scoringComplete', {
      vendorName: activeVendor.name,
      overallScore: scores.overallAvg,
      scoreResult: scores.informationalOnly ? 'Informational (Routine Supplier)' : scores.passed ? 'Passed' : 'Below Threshold',
    });
  }, [dispatch, activeVendor]);

  const declineApplication = useCallback(() => dispatch({ type: ACTIONS.DECLINE_APPLICATION }), [dispatch]);

  /**
   * Step 6 scrutiny gate. Reads the pass/fail already computed by the real
   * scoring engine in Step 5 (per-tier thresholds - see utils/scoring.js)
   * rather than a single hardcoded number. A pass does NOT jump straight to
   * ERP export - the vendor still owes the final registration fee.
   */
  const executeRiskBasedApproval = useCallback(() => {
    const passed = activeVendor?.scores?.passed;

    if (passed === false) {
      dispatch({ type: ACTIONS.REJECT_LOW_SCORE });
      showToast('AUTO-REJECT: ESG SCORE BELOW TIER THRESHOLD', true);
      return;
    }
    dispatch({ type: ACTIONS.APPROVE_VENDOR });
    showToast('ESG Scrutiny Passed — Final Registration Fee Due.');
    if (activeVendor) {
      sendNotification('finalPaymentRequested', {
        vendorName: activeVendor.name,
        applicationId: activeVendor.applicationId,
        paymentLink: `https://portal.example.com/pay/${activeVendor.id}`,
        amount: 1000,
      });
    }
  }, [dispatch, showToast, activeVendor]);

  /** Step 6's final registration-fee payment, gating entry into the Approved Vendor List. */
  const authorizeFinalPayment = useCallback(
    (method, onStart) => {
      onStart?.();
      const txnId = generateTxnId();
      const vendorSnapshot = activeVendor;
      setTimeout(() => {
        dispatch({ type: ACTIONS.AUTHORIZE_FINAL_PAYMENT, method, txnId });
        showToast('Executive Authorization Granted.');
        if (vendorSnapshot) {
          sendNotification('vendorApproved', {
            vendorName: vendorSnapshot.name,
            applicationId: vendorSnapshot.applicationId,
            txnId,
          });
        }
      }, 1200);
    },
    [dispatch, showToast, activeVendor]
  );

  /** Continue button on the final receipt - advances into ERP Sync (Step 7). */
  const ackFinalReceipt = useCallback(() => dispatch({ type: ACTIONS.ACK_FINAL_RECEIPT }), [dispatch]);

  const advanceToStep8 = useCallback(() => simulateProcessing(8), [simulateProcessing]);

  /** Admin override — approves a vendor regardless of stage, bypassing payment/scoring gates. */
  const adminForceApprove = useCallback(
    (index) => {
      dispatch({ type: ACTIONS.ADMIN_FORCE_APPROVE, index });
      showToast('Vendor approved by admin override.');
    },
    [dispatch, showToast]
  );

  /** Admin control — permanently removes a vendor record from the registry. */
  const deleteVendor = useCallback(
    (index) => {
      dispatch({ type: ACTIONS.DELETE_VENDOR, index });
      showToast('Vendor record deleted.');
    },
    [dispatch, showToast]
  );

  return {
    showToast,
    hideToast,
    simulateProcessing,
    showView,
    launchPortal,
    goBackStep,
    resetPortal,
    registerVendor,
    backToRegView,
    switchVendor,
    setPayMethod,
    authorizePayment,
    ackPaymentReceipt,
    setTier,
    submitQuestionnaire,
    requestAdditionalInfo,
    resubmitAnswers,
    acceptQuestionnaire,
    computeScores,
    declineApplication,
    executeRiskBasedApproval,
    authorizeFinalPayment,
    ackFinalReceipt,
    advanceToStep8,
    adminForceApprove,
    deleteVendor,
  };
}
