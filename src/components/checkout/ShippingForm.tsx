import { useState } from 'react';
import { ShippingSchema } from '../../schemas/shippingSchema';
import type { ShippingFormData } from '../../schemas/shippingSchema';

interface ShippingFormProps {
  onNext: (data: ShippingFormData) => void;
  onBack: () => void;
}

type FieldErrors = Partial<Record<keyof ShippingFormData, string>>;

const INITIAL: ShippingFormData = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
};

interface FieldConfig {
  key: keyof ShippingFormData;
  label: string;
  type?: string;
  placeholder: string;
  span?: 'full' | 'half';
}

const FIELDS: FieldConfig[] = [
  { key: 'fullName', label: 'Full Name', placeholder: 'Rahul Sharma', span: 'full' },
  { key: 'email', label: 'Email Address', type: 'email', placeholder: 'rahul@example.com' },
  { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 98765 43210' },
  { key: 'address', label: 'Street Address', placeholder: '123, MG Road, Apartment 4B', span: 'full' },
  { key: 'city', label: 'City', placeholder: 'Mumbai' },
  { key: 'state', label: 'State', placeholder: 'Maharashtra' },
  { key: 'zipCode', label: 'PIN Code', placeholder: '400001' },
  { key: 'country', label: 'Country', placeholder: 'India' },
];

export function ShippingForm({ onNext, onBack }: ShippingFormProps) {
  const [values, setValues] = useState<ShippingFormData>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState(false);

  const handleChange = (key: keyof ShippingFormData, value: string) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (touched && errors[key]) {
      const res = ShippingSchema.safeParse(next);
      if (res.success) {
        setErrors((prev) => ({ ...prev, [key]: undefined }));
      } else {
        const issue = res.error.issues.find((i) => i.path[0] === key);
        setErrors((prev) => ({ ...prev, [key]: issue?.message }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const res = ShippingSchema.safeParse(values);
    if (!res.success) {
      const errs: FieldErrors = {};
      res.error.issues.forEach((i) => {
        const k = i.path[0] as keyof ShippingFormData;
        if (!errs[k]) errs[k] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    onNext(res.data);
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ maxWidth: 660, margin: '0 auto' }}>
      <div className="card" style={{ overflow: 'hidden' }}>
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-elevated)',
          }}
        >
          <h3
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 17,
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 4,
            }}
          >
            📦 Delivery Details
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            All fields are required to proceed
          </p>
        </div>

        {/* Form grid */}
        <div
          style={{
            padding: 24,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 18,
          }}
        >
          {FIELDS.map(({ key, label, type = 'text', placeholder, span }) => (
            <div
              key={key}
              style={{
                gridColumn: span === 'full' ? '1 / -1' : 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <label
                htmlFor={key}
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {label} <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <input
                id={key}
                type={type}
                className={`input${errors[key] ? ' input-error' : ''}`}
                placeholder={placeholder}
                value={values[key]}
                onChange={(e) => handleChange(key, e.target.value)}
              />
              {errors[key] && (
                <span
                  style={{
                    fontSize: 12,
                    color: 'var(--error)',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span>⚠</span> {errors[key]}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div
          style={{
            padding: '16px 24px 20px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
            background: 'var(--bg-elevated)',
          }}
        >
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            ← Back to Cart
          </button>
          <button type="submit" className="btn btn-primary" style={{ padding: '11px 32px' }}>
            Review Order →
          </button>
        </div>
      </div>
    </form>
  );
}
