import { useState, type ChangeEvent, type FormEvent } from "react";
import type { FormErrors, Salutation, UserFormData } from "../types";
import { validate } from "../validation";
import { submitToSheet } from "../api";

const INITIAL: UserFormData = {
  salutation: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  houseName: "",
  gothram: "",
  education: "",
  occupation: "",
  fatherName: "",
  pincode: "",
  mobileNumber: "",
  email: "",
  maritalStatus: "",
};

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const SALUTATION_OPTIONS: { value: Salutation; ta: string }[] = [
  { value: "Mr", ta: "திரு" },
  { value: "Mrs", ta: "திருமதி" },
  { value: "Miss", ta: "செல்வி" },
  { value: "Master", ta: "செல்வன்" },
  { value: "Dr", ta: "டாக்டர்" },
];

const GENDER_OPTIONS: { value: "Male" | "Female" | "Other"; ta: string }[] = [
  { value: "Male", ta: "ஆண்" },
  { value: "Female", ta: "பெண்" },
  { value: "Other", ta: "பிறர்" },
];

const MARITAL_OPTIONS: { value: "Married" | "Unmarried"; ta: string }[] = [
  { value: "Married", ta: "திருமணம் ஆனவர்" },
  { value: "Unmarried", ta: "திருமணம் ஆகாதவர்" },
];

export default function UserForm() {
  const [data, setData] = useState<UserFormData>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  function update<K extends keyof UserFormData>(key: K, value: UserFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function handleText(key: keyof UserFormData) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      update(key, e.target.value as UserFormData[typeof key]);
  }

  function handleDigits(key: keyof UserFormData, max: number) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const cleaned = e.target.value.replace(/\D/g, "").slice(0, max);
      update(key, cleaned as UserFormData[typeof key]);
    };
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validationErrors = validate(data);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setStatus({ kind: "idle" });
      return;
    }

    setStatus({ kind: "submitting" });
    try {
      await submitToSheet(data);
      setStatus({ kind: "success" });
      setData(INITIAL);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setStatus({ kind: "error", message });
    }
  }

  return (
    <form className="user-form" onSubmit={handleSubmit} noValidate>
      <Field
        label="Salutation"
        tamil="மரியாதை அழைப்பு"
        error={errors.salutation}
        htmlFor="salutation"
        span="third"
      >
        <select
          id="salutation"
          value={data.salutation}
          onChange={handleText("salutation")}
        >
          <option value="">Select…</option>
          {SALUTATION_OPTIONS.map(({ value, ta }) => (
            <option key={value} value={value}>
              {value} ({ta})
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="First Name"
        tamil="முதல் பெயர்"
        error={errors.firstName}
        htmlFor="firstName"
      >
        <input
          id="firstName"
          type="text"
          value={data.firstName}
          onChange={handleText("firstName")}
          placeholder="e.g. Kumar"
          autoComplete="given-name"
        />
      </Field>

      <Field
        label="Last Name (Initial / Surname)"
        tamil="கடைசி பெயர் (இனிஷியல்)"
        error={errors.lastName}
        htmlFor="lastName"
      >
        <input
          id="lastName"
          type="text"
          value={data.lastName}
          onChange={handleText("lastName")}
          placeholder="e.g. V."
          autoComplete="family-name"
        />
      </Field>

      <Field
        label="Date of Birth"
        tamil="பிறந்த தேதி"
        error={errors.dateOfBirth}
        htmlFor="dateOfBirth"
      >
        <input
          id="dateOfBirth"
          type="date"
          value={data.dateOfBirth}
          onChange={handleText("dateOfBirth")}
          min="1900-01-01"
          max={new Date().toISOString().slice(0, 10)}
        />
      </Field>

      <Field
        label="Gender"
        tamil="பாலினம்"
        error={errors.gender}
        htmlFor="gender"
      >
        <div className="radio-group" role="radiogroup" id="gender">
          {GENDER_OPTIONS.map(({ value, ta }) => (
            <label key={value} className="radio">
              <input
                type="radio"
                name="gender"
                value={value}
                checked={data.gender === value}
                onChange={() => update("gender", value)}
              />
              <span>
                {value} <span className="ta-inline">/ {ta}</span>
              </span>
            </label>
          ))}
        </div>
      </Field>

      <Field
        label="House Name"
        tamil="வீட்டு பெயர்"
        error={errors.houseName}
        htmlFor="houseName"
      >
        <input
          id="houseName"
          type="text"
          value={data.houseName}
          onChange={handleText("houseName")}
          placeholder="Family / house name"
        />
      </Field>

      <Field
        label="Gothram (Clan / Lineage)"
        tamil="கோத்திரம்"
        error={errors.gothram}
        htmlFor="gothram"
      >
        <input
          id="gothram"
          type="text"
          value={data.gothram}
          onChange={handleText("gothram")}
          placeholder="e.g. Bharadwaja"
        />
      </Field>

      <Field
        label="Education / Qualification"
        tamil="படிப்பு"
        error={errors.education}
        htmlFor="education"
      >
        <input
          id="education"
          type="text"
          value={data.education}
          onChange={handleText("education")}
          placeholder="e.g. B.E. Computer Science"
        />
      </Field>

      <Field
        label="Current Occupation / Job"
        tamil="தற்சமயம் செய்யும் தொழில் / வேலை"
        error={errors.occupation}
        htmlFor="occupation"
      >
        <input
          id="occupation"
          type="text"
          value={data.occupation}
          onChange={handleText("occupation")}
          placeholder="Job / business / role"
        />
      </Field>

      <Field
        label="Father's Name"
        tamil="தகப்பனார் பெயர்"
        error={errors.fatherName}
        htmlFor="fatherName"
      >
        <input
          id="fatherName"
          type="text"
          value={data.fatherName}
          onChange={handleText("fatherName")}
        />
      </Field>

      <Field
        label="Area Pincode"
        tamil="உங்கள் ஏரியா பின் கோடு"
        error={errors.pincode}
        htmlFor="pincode"
      >
        <input
          id="pincode"
          type="text"
          inputMode="numeric"
          value={data.pincode}
          onChange={handleDigits("pincode", 6)}
          placeholder="6-digit pincode"
          maxLength={6}
        />
      </Field>

      <Field
        label="Mobile Number"
        tamil="செல் நம்பர்"
        error={errors.mobileNumber}
        htmlFor="mobileNumber"
      >
        <input
          id="mobileNumber"
          type="tel"
          inputMode="numeric"
          value={data.mobileNumber}
          onChange={handleDigits("mobileNumber", 10)}
          placeholder="10-digit mobile"
          maxLength={10}
          autoComplete="tel"
        />
      </Field>

      <Field
        label="Email ID"
        tamil="இ மெயில் ஐடி"
        error={errors.email}
        htmlFor="email"
      >
        <input
          id="email"
          type="email"
          value={data.email}
          onChange={handleText("email")}
          placeholder="name@example.com"
          autoComplete="email"
        />
      </Field>

      <Field
        label="Marital Status"
        tamil="திருமணம் ஆனவரா?"
        error={errors.maritalStatus}
        htmlFor="maritalStatus"
      >
        <div className="radio-group" role="radiogroup" id="maritalStatus">
          {MARITAL_OPTIONS.map(({ value, ta }) => (
            <label key={value} className="radio">
              <input
                type="radio"
                name="maritalStatus"
                value={value}
                checked={data.maritalStatus === value}
                onChange={() => update("maritalStatus", value)}
              />
              <span>
                {value} <span className="ta-inline">/ {ta}</span>
              </span>
            </label>
          ))}
        </div>
      </Field>

      <div className="form-footer">
        <button
          type="submit"
          className="submit-btn"
          disabled={status.kind === "submitting"}
        >
          {status.kind === "submitting" ? "Submitting..." : "Submit / சமர்ப்பி"}
        </button>

        {status.kind === "success" && (
          <p className="status status-success">
            Submitted successfully. Thank you! / வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது. நன்றி!
          </p>
        )}
        {status.kind === "error" && (
          <p className="status status-error">{status.message}</p>
        )}
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  tamil: string;
  htmlFor: string;
  error?: string;
  span?: "third" | "half" | "full";
  children: React.ReactNode;
}

function Field({ label, tamil, htmlFor, error, span, children }: FieldProps) {
  const spanClass = span ? ` field-${span}` : "";
  return (
    <div className={`field${spanClass}${error ? " field-error" : ""}`}>
      <label htmlFor={htmlFor}>
        <span className="label-en">{label}</span>
        <span className="label-ta">{tamil}</span>
      </label>
      {children}
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}
