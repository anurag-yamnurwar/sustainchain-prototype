# SustainChain Suite — React + Vite

Enterprise multi-vendor ESG vetting application. Rebuilt from a single-file HTML prototype into a properly structured React app.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Build | Vite 8 | Fast HMR, actively maintained, replaces deprecated CRA |
| UI | React 19 + plain JSX | Matches original code style |
| State | Context + useReducer | Built-in, no extra libs, scales cleanly |
| Styles | Tailwind CSS v4 | Vite plugin — no PostCSS config needed |
| Charts | Chart.js 4 | Radar + bar charts, same as original |
| ERP Export | SheetJS | .xlsx generation for SAP/Oracle ingestion |

---

## Quickstart

```bash
# 1 — Install dependencies
npm install

# IMPORTANT — SheetJS fix (see note below)
npm install https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz

# 2 — Start dev server
npm run dev

# 3 — Build for production
npm run build
```

### SheetJS note
The `xlsx` package on npm (v0.18.x) has an unpatched prototype-pollution vulnerability.
SheetJS distributes fixed versions only from their own CDN. Run this **once** after `npm install`:

```bash
npm install https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz
```

This replaces the vulnerable npm version with the patched CDN build. No other code changes needed.

---

## Project Structure

```
src/
├── main.jsx                    Entry point — mounts PortalProvider + App
├── App.jsx                     Top-level view router (home / methodology / portal)
│
├── context/
│   ├── portalContextObject.js  The React context object (exported separately for Fast Refresh)
│   ├── PortalContext.jsx       PortalProvider component — wraps the whole app
│   └── initialState.js         Starting state shape
│
├── reducers/
│   ├── actionTypes.js          Named constants for every possible action
│   └── portalReducer.js        All state transitions as pure functions (testable, no DOM)
│
├── hooks/
│   ├── usePortal.js            Access { state, dispatch } anywhere in the tree
│   ├── useActiveVendor.js      Selector — returns the current vendor object
│   └── usePortalActions.js     All dispatch + side-effect logic (toasts, timers, validation)
│
├── data/
│   ├── auditQuestions.js       ESG question set and per-category max points
│   ├── stepLabels.js           The 8-stage stepper labels
│   └── tierOptions.js          Tier A/B/C config + rejection threshold constant
│
├── utils/
│   ├── scoring.js              ESG score math (pure, framework-agnostic, testable)
│   ├── erpExport.js            SheetJS .xlsx generation — isolated from UI
│   └── idGenerator.js          Vendor ID generator
│
└── components/
    ├── common/
    │   └── ChartCanvas.jsx     Chart.js wrapper — handles mount/update/destroy lifecycle
    ├── layout/
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   └── Toast.jsx
    ├── views/
    │   ├── HomeView.jsx
    │   ├── MethodologyView.jsx
    │   └── PortalView.jsx      Portal shell: header, stepper, step switcher
    └── portal-steps/
        ├── Stepper.jsx
        ├── VendorSwitcher.jsx
        ├── Step1.jsx           Wrapper: switches between Identity form and Payment
        ├── Step1Identity.jsx   Registration form (local form state)
        ├── Step1Payment.jsx    Payment gateway simulation
        ├── Step2Classification.jsx   Risk tier selection
        ├── Step3Audit.jsx      ESG audit matrix (local answer state)
        ├── Step4Signature.jsx  Score results + radar chart
        ├── Step5Dialogue.jsx   Auditor communication log
        ├── Step6Scrutiny.jsx   Human approval gate + lifecycle history
        ├── Step7ErpSync.jsx    ERP master data export
        └── Step8Dashboard.jsx  KPI dashboard + bar chart
```

---

## Adding a New Step (Future Workflow)

1. Create `src/components/portal-steps/Step9YourStep.jsx`
2. Add the label to `src/data/stepLabels.js`
3. Register the component in the `stepComponents` map in `src/components/views/PortalView.jsx`
4. Add any new action types to `src/reducers/actionTypes.js`
5. Add corresponding state transitions to `src/reducers/portalReducer.js`

That's the only surface area you touch. Every other component continues to work unchanged.

---

## State Architecture

```
PortalProvider (useReducer)
       │
       ▼
  { state, dispatch }
  PortalContext
       │
  ┌────┴────────────────────────────────────────┐
  │                                             │
usePortal()                            usePortalActions()
(raw state)                    (pre-wired dispatch + side effects)
       │                                         │
       ▼                                         ▼
  Components                              Components
  (read only)                        (trigger transitions)
```

---

## ESG Risk Rejection Threshold

The auto-reject gate (Step 6) fires when `scores.aggregate < 40`.
Change this in `src/data/tierOptions.js`:

```js
export const RISK_REJECT_THRESHOLD = 40; // adjust here
```

No component code needs changing.
