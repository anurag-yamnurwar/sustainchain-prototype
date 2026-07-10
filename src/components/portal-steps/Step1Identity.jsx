import { useState, useRef } from 'react';
import { usePortalActions } from '../../hooks/usePortalActions';

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_FILE_BYTES = 2 * 1024 * 1024; // 2 MB

const EMPTY_FORM = {
  vendorName: '',
  crNumber: '',
  gstNumber: '',
  address: '',
  email: '',
  mobile: '',
  landline: '',
  bankDetails: '',
};

// ─── Per-field validation (runs on submit attempt) ────────────────────────────
function validateAll(form, products, productBrochure) {
  const e = {};
  if (!form.vendorName.trim())
    e.vendorName = 'Legal vendor name is required';

  if (!form.crNumber.trim())
    e.crNumber = 'Company Registration number is required';

  if (!form.gstNumber.trim())
    e.gstNumber = 'GST / Tax ID is required';
  else if (form.gstNumber.replace(/\s/g, '').length !== 15)
    e.gstNumber = 'GST Number must be exactly 15 characters';

  if (!form.address.trim())
    e.address = 'Registered address is required';

  if (!form.email.trim())
    e.email = 'Email address is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    e.email = 'Enter a valid email address';

  if (!form.mobile.trim())
    e.mobile = 'Mobile number is required';
  else if (!/^\d{10}$/.test(form.mobile.replace(/[\s\-+()\u00a0]/g, '')))
    e.mobile = 'Must be a valid 10-digit mobile number';

  if (!form.bankDetails.trim())
    e.bankDetails = 'Bank account / IBAN details are required';

  if (products.length === 0)
    e.products = 'Add at least one product to the catalog';

  if (!productBrochure)
    e.productBrochure = 'Product brochure (PDF) is required';

  return e;
}

// ─── Reusable sub-components (kept in this file for locality) ─────────────────

function SectionHeader({ number, title, subtitle }) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5 shadow-sm shadow-emerald-200">
        {number}
      </div>
      <div>
        <h4 className="text-base font-black text-slate-800 tracking-tight">{title}</h4>
        {subtitle && <p className="text-xs text-slate-400 font-medium mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function Field({ label, required, hint, error, children }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
        {hint && <span className="text-slate-400 font-normal normal-case ml-1.5 text-[10px]">{hint}</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-red-500 text-[11px] mt-1.5 font-semibold">
          <svg className="w-3 h-3 shrink-0" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4.5h1.5v4h-1.5v-4zm0 5h1.5v1.5h-1.5V10.5z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

function Input({ error, className = '', ...props }) {
  const base =
    'w-full px-5 py-4 bg-white border rounded-2xl text-sm font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-300 placeholder:font-normal';
  const normal = 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10';
  const errored = 'border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-2 focus:ring-red-400/10';
  return (
    <input
      className={`${base} ${error ? errored : normal} ${className}`}
      {...props}
    />
  );
}

function FileUploadZone({ label, required, hint, accept, error, file, onFile }) {
  const ref = useRef(null);

  const handleChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > MAX_FILE_BYTES) {
      onFile(null, 'File exceeds 2MB limit. Please upload a smaller file.');
    } else {
      onFile(f, null);
    }
    // reset so the same file can be re-selected after removing
    e.target.value = '';
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <Field label={label} required={required} hint={hint} error={error}>
      <input ref={ref} type="file" accept={accept ?? '.pdf'} onChange={handleChange} className="hidden" />

      {file ? (
        /* ── File selected state ── */
        <div className="flex items-center justify-between gap-4 px-5 py-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-emerald-800 truncate">{file.name}</p>
              <p className="text-[11px] text-emerald-600 font-medium">{formatBytes(file.size)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <button
              type="button"
              onClick={() => onFile(null, null)}
              className="text-slate-400 hover:text-red-500 transition-colors"
              aria-label="Remove file"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        /* ── Empty / click-to-upload state ── */
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className={`w-full px-6 py-6 border-2 border-dashed rounded-2xl flex flex-col items-center gap-2 transition-all hover:bg-slate-50 hover:border-emerald-400 group ${
            error ? 'border-red-300 bg-red-50/30' : 'border-slate-200 bg-white'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${error ? 'bg-red-100' : 'bg-slate-100 group-hover:bg-emerald-100'}`}>
            <svg className={`w-5 h-5 transition-colors ${error ? 'text-red-400' : 'text-slate-400 group-hover:text-emerald-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div className="text-center">
            <p className={`text-[11px] font-bold uppercase tracking-wider ${error ? 'text-red-500' : 'text-slate-500'}`}>
              Click to upload PDF
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Maximum file size: 2 MB</p>
          </div>
        </button>
      )}
    </Field>
  );
}

function Tag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 bg-slate-800 text-white text-[11px] font-bold uppercase tracking-wide px-3.5 py-2 rounded-xl">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="text-slate-400 hover:text-red-400 transition-colors leading-none"
        aria-label={`Remove ${label}`}
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </span>
  );
}

// ─── Progress bar (section-level, shown at top on mobile) ────────────────────
const SECTIONS = [
  'Business Identity',
  'Address',
  'Contact',
  'Banking',
  'Products',
  'Services',
];

function FormProgress({ completedCount }) {
  return (
    <div className="mb-8 md:hidden">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Registration Progress</span>
        <span className="text-[11px] font-bold text-emerald-600">{completedCount}/{SECTIONS.length}</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${(completedCount / SECTIONS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Step1Identity() {
  const { registerVendor, showToast } = usePortalActions();

  // ── Local form state ──
  const [form, setForm] = useState(EMPTY_FORM);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [productInput, setProductInput] = useState('');
  const [serviceInput, setServiceInput] = useState('');
  const [productBrochure, setProductBrochure] = useState(null);
  const [serviceBrochure, setServiceBrochure] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    // Clear the error for this field as soon as the user starts correcting it
    if (errors[field]) setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
  };

  // onBlur placeholder — kept for future per-field live validation expansion
  const markTouched = () => () => {};

  // ── Catalog handlers ──
  const addItem = (input, setInput, list, setList, errorKey) => {
    const val = input.trim();
    if (!val) return;
    setList([...list, val]);
    setInput('');
    if (errors[errorKey]) setErrors((prev) => { const next = { ...prev }; delete next[errorKey]; return next; });
  };

  const removeItem = (index, list, setList) =>
    setList(list.filter((_, i) => i !== index));

  const handleProductKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addItem(productInput, setProductInput, products, setProducts, 'products'); }
  };
  const handleServiceKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addItem(serviceInput, setServiceInput, services, setServices, 'services'); }
  };

  // ── Progress tracking (for the mobile progress bar + desktop sidebar) ──
  const completedCount = [
    form.vendorName && form.crNumber && form.gstNumber,
    form.address,
    form.email && form.mobile,
    form.bankDetails,
    products.length > 0 && productBrochure,
    true, // services section is optional
  ].filter(Boolean).length;

  // ── Submit ──
  const handleSubmit = () => {
    const validationErrors = validateAll(form, products, productBrochure);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to the first error
      const firstErrorEl = document.querySelector('[data-error="true"]');
      firstErrorEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    const businessError = registerVendor({
      ...form,
      products,
      services,
      productBrochure: productBrochure?.name,
      serviceBrochure: serviceBrochure?.name ?? null,
    });

    if (businessError) {
      showToast(businessError, true);
      setIsSubmitting(false);
    }
    // On success: reducer sets step1Phase → 'payment', this component unmounts
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto">

      {/* ── Page Header ── */}
      <div className="mb-10">
        <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">New Vendor Registration</h3>
        <p className="text-slate-400 text-sm font-medium mt-2">
          Complete all required sections below to proceed to application fee payment.
          Fields marked <span className="text-red-400 font-bold">*</span> are mandatory.
        </p>
      </div>

      {/* Mobile progress bar */}
      <FormProgress completedCount={completedCount} />

      <div className="flex gap-10 items-start">

        {/* ── Desktop Sidebar ── */}
        <aside className="hidden lg:block w-56 shrink-0 sticky top-28">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Sections</p>
          <nav className="space-y-1">
            {SECTIONS.map((s, i) => {
              const sectionDone = [
                form.vendorName && form.crNumber && form.gstNumber,
                form.address,
                form.email && form.mobile,
                form.bankDetails,
                products.length > 0 && productBrochure,
                true,
              ][i];
              return (
                <a
                  key={s}
                  href={`#section-${i + 1}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all hover:bg-slate-50 group"
                >
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 transition-all ${sectionDone ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {sectionDone ? (
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    ) : (i + 1)}
                  </div>
                  <span className={`transition-colors ${sectionDone ? 'text-emerald-700' : 'text-slate-500 group-hover:text-slate-700'}`}>{s}</span>
                </a>
              );
            })}
          </nav>

          <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase mb-2">
              <span>Progress</span>
              <span className="text-emerald-600">{completedCount}/{SECTIONS.length}</span>
            </div>
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / SECTIONS.length) * 100}%` }}
              />
            </div>
          </div>
        </aside>

        {/* ── Main Form ── */}
        <div className="flex-1 space-y-6">

          {/* ══ Section 1: Business Identity ══ */}
          <div id="section-1" className="bg-slate-50/70 border border-slate-100 rounded-3xl p-7 md:p-9">
            <SectionHeader number="1" title="Business Identity" subtitle="Legal registration details of the vendor organisation" />
            <div className="space-y-5">
              <Field label="Legal Vendor Name" required error={errors.vendorName}>
                <Input
                  type="text"
                  placeholder="e.g. Acme Industrial Supplies Pvt. Ltd."
                  value={form.vendorName}
                  onChange={setField('vendorName')}
                  onBlur={markTouched('vendorName')}
                  error={errors.vendorName}
                  data-error={!!errors.vendorName}
                />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Company Registration (CR) Number" required error={errors.crNumber}>
                  <Input
                    type="text"
                    placeholder="e.g. U12345MH2010PTC123456"
                    value={form.crNumber}
                    onChange={setField('crNumber')}
                    onBlur={markTouched('crNumber')}
                    error={errors.crNumber}
                  />
                </Field>
                <Field label="GST / Tax Identification Number" required hint="(15 characters)" error={errors.gstNumber}>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="e.g. 27AAPFU0939F1ZV"
                      value={form.gstNumber}
                      onChange={setField('gstNumber')}
                      onBlur={markTouched('gstNumber')}
                      error={errors.gstNumber}
                      maxLength={15}
                    />
                    <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-bold tabular-nums ${form.gstNumber.length === 15 ? 'text-emerald-500' : 'text-slate-300'}`}>
                      {form.gstNumber.length}/15
                    </span>
                  </div>
                </Field>
              </div>
            </div>
          </div>

          {/* ══ Section 2: Registered Address ══ */}
          <div id="section-2" className="bg-slate-50/70 border border-slate-100 rounded-3xl p-7 md:p-9">
            <SectionHeader number="2" title="Registered Address" subtitle="Official corporate / registered office address" />
            <Field label="Full Corporate Address" required error={errors.address}>
              <textarea
                rows={3}
                placeholder="Street, City, State, PIN Code, Country"
                value={form.address}
                onChange={setField('address')}
                onBlur={markTouched('address')}
                className={`w-full px-5 py-4 bg-white border rounded-2xl text-sm font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-300 placeholder:font-normal resize-none ${
                  errors.address
                    ? 'border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-2 focus:ring-red-400/10'
                    : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10'
                }`}
              />
              {errors.address && (
                <p className="flex items-center gap-1.5 text-red-500 text-[11px] mt-1.5 font-semibold">
                  <svg className="w-3 h-3 shrink-0" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4.5h1.5v4h-1.5v-4zm0 5h1.5v1.5h-1.5V10.5z" /></svg>
                  {errors.address}
                </p>
              )}
            </Field>
          </div>

          {/* ══ Section 3: Contact Information ══ */}
          <div id="section-3" className="bg-slate-50/70 border border-slate-100 rounded-3xl p-7 md:p-9">
            <SectionHeader number="3" title="Contact Information" subtitle="Primary points of contact for procurement communication" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Field label="Email Address" required error={errors.email}>
                <Input
                  type="email"
                  placeholder="procurement@vendor.com"
                  value={form.email}
                  onChange={setField('email')}
                  onBlur={markTouched('email')}
                  error={errors.email}
                />
              </Field>
              <Field label="Mobile Number" required hint="(10 digits)" error={errors.mobile}>
                <Input
                  type="tel"
                  placeholder="9876543210"
                  value={form.mobile}
                  onChange={setField('mobile')}
                  onBlur={markTouched('mobile')}
                  error={errors.mobile}
                  maxLength={10}
                />
              </Field>
              <Field label="Landline Number" hint="(optional)" error={errors.landline}>
                <Input
                  type="tel"
                  placeholder="022-12345678"
                  value={form.landline}
                  onChange={setField('landline')}
                  onBlur={markTouched('landline')}
                  error={errors.landline}
                />
              </Field>
            </div>
          </div>

          {/* ══ Section 4: Banking & Settlement ══ */}
          <div id="section-4" className="bg-slate-50/70 border border-slate-100 rounded-3xl p-7 md:p-9">
            <SectionHeader number="4" title="Banking & Settlement" subtitle="Bank account details for payment processing and invoice settlement" />
            <Field label="Bank Account / IBAN / SWIFT Details" required hint="(account number, IFSC, or IBAN)" error={errors.bankDetails}>
              <Input
                type="text"
                placeholder="e.g. HDFC Bank — A/C: 50100123456789 — IFSC: HDFC0001234"
                value={form.bankDetails}
                onChange={setField('bankDetails')}
                onBlur={markTouched('bankDetails')}
                error={errors.bankDetails}
              />
            </Field>
            <div className="flex items-start gap-2.5 mt-4 px-4 py-3 bg-amber-50 border border-amber-100 rounded-2xl">
              <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                Ensure details are accurate. Settlement payments will be processed to this account. Incorrect details may cause delays.
              </p>
            </div>
          </div>

          {/* ══ Section 5: Product Catalog ══ */}
          <div id="section-5" className="bg-slate-50/70 border border-slate-100 rounded-3xl p-7 md:p-9">
            <SectionHeader
              number="5"
              title="Product Catalog"
              subtitle="List all products being offered. At least one product and a product brochure are required."
            />
            <div className="space-y-5">
              {/* Add product input */}
              <Field label="Add Product" required error={errors.products}>
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="Enter product name and press Add or Enter"
                    value={productInput}
                    onChange={(e) => setProductInput(e.target.value)}
                    onKeyDown={handleProductKeyDown}
                    error={errors.products && products.length === 0}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => addItem(productInput, setProductInput, products, setProducts, 'products')}
                    className="px-6 bg-slate-800 text-white font-black text-sm rounded-2xl hover:bg-black transition-colors shrink-0"
                  >
                    Add
                  </button>
                </div>
              </Field>

              {/* Product tags */}
              {products.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {products.map((p, i) => (
                    <Tag key={i} label={p} onRemove={() => removeItem(i, products, setProducts)} />
                  ))}
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-slate-200 pt-5">
                <FileUploadZone
                  label="Product Brochure"
                  required
                  hint="PDF, max 2 MB"
                  accept=".pdf"
                  error={errors.productBrochure}
                  file={productBrochure}
                  onFile={(file, err) => {
                    setProductBrochure(file);
                    if (err) showToast(err, true);
                    if (file && errors.productBrochure)
                      setErrors((prev) => { const next = { ...prev }; delete next.productBrochure; return next; });
                  }}
                />
              </div>
            </div>
          </div>

          {/* ══ Section 6: Service Catalog ══ */}
          <div id="section-6" className="bg-slate-50/70 border border-slate-100 rounded-3xl p-7 md:p-9">
            <SectionHeader
              number="6"
              title="Service Catalog"
              subtitle="List any services offered alongside products. This section is optional."
            />
            <div className="space-y-5">
              <Field label="Add Service" hint="(optional)">
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="Enter service name and press Add or Enter"
                    value={serviceInput}
                    onChange={(e) => setServiceInput(e.target.value)}
                    onKeyDown={handleServiceKeyDown}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => addItem(serviceInput, setServiceInput, services, setServices, 'services')}
                    className="px-6 bg-slate-800 text-white font-black text-sm rounded-2xl hover:bg-black transition-colors shrink-0"
                  >
                    Add
                  </button>
                </div>
              </Field>

              {services.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {services.map((s, i) => (
                    <Tag key={i} label={s} onRemove={() => removeItem(i, services, setServices)} />
                  ))}
                </div>
              )}

              <div className="border-t border-slate-200 pt-5">
                <FileUploadZone
                  label="Service Brochure"
                  hint="PDF, max 2 MB — optional"
                  accept=".pdf"
                  error={null}
                  file={serviceBrochure}
                  onFile={(file, err) => {
                    setServiceBrochure(file);
                    if (err) showToast(err, true);
                  }}
                />
              </div>
            </div>
          </div>

          {/* ══ Submit ══ */}
          <div className="pt-2 pb-8">
            {/* Validation summary (shown only after a failed submit attempt) */}
            {Object.keys(errors).length > 0 && (
              <div className="flex items-start gap-3 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl mb-5">
                <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-sm text-red-700 font-semibold">
                  {Object.keys(errors).length} issue{Object.keys(errors).length > 1 ? 's' : ''} found. Please review the sections above before proceeding.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-5 bg-emerald-600 text-white font-black text-lg rounded-3xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all transform hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="loader" />
                  <span>Processing Registration...</span>
                </>
              ) : (
                <>
                  <span>Save & Proceed to Payment</span>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-3 font-medium">
              Your registration details are saved securely. A non-refundable application fee applies.
            </p>
          </div>

        </div>{/* end main form */}
      </div>{/* end flex container */}
    </div>
  );
}
