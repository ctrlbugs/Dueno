import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import {
  AGENT_OPERATION_AREAS,
  AGENT_PROPERTY_CATEGORIES,
  ID_DOCUMENT_LABELS,
  NIGERIAN_BANKS,
  PROFESSIONAL_MEMBERSHIPS,
  type AgentRegistrationDetails,
  type IdDocumentType,
} from "../../types/agentRegistration";
import { all_routes } from "../../feature-module/routes/all_routes";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
  "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
  "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const STEPS = [
  "Personal",
  "Contact",
  "Identity (KYC)",
  "Business",
  "Professional",
  "Bank",
  "Login & Legal",
] as const;

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const MAX_FILE_BYTES = 2 * 1024 * 1024;

export type AgentRegistrationSubmit = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  agencyName: string;
  licenseNumber: string;
  city: string;
  state: string;
  registration: AgentRegistrationDetails;
};

type Props = {
  onSubmit: (values: AgentRegistrationSubmit) => Promise<void> | void;
  loading?: boolean;
  error?: string | null;
};

type FormState = {
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: AgentRegistrationDetails["gender"] | "";
  nationality: string;
  profilePhotoDataUrl: string;
  email: string;
  phone: string;
  alternatePhone: string;
  residentialAddress: string;
  state: string;
  city: string;
  lga: string;
  idDocumentType: IdDocumentType;
  idDocumentDataUrl: string;
  agentType: AgentRegistrationDetails["agentType"];
  companyName: string;
  cacRegistrationNumber: string;
  cacCertificateDataUrl: string;
  yearsOfExperience: string;
  areasOfOperation: string[];
  propertyCategories: string[];
  isLicensedPractitioner: boolean;
  licenseNumber: string;
  professionalMemberships: string[];
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
  password: string;
  confirmPassword: string;
  certifiedAccurate: boolean;
  termsAccepted: boolean;
  privacyAccepted: boolean;
};

const initialForm = (): FormState => ({
  firstName: "",
  lastName: "",
  middleName: "",
  dateOfBirth: "",
  gender: "",
  nationality: "Nigerian",
  profilePhotoDataUrl: "",
  email: "",
  phone: "",
  alternatePhone: "",
  residentialAddress: "",
  state: "Lagos",
  city: "",
  lga: "",
  idDocumentType: "nin",
  idDocumentDataUrl: "",
  agentType: "individual",
  companyName: "",
  cacRegistrationNumber: "",
  cacCertificateDataUrl: "",
  yearsOfExperience: "0",
  areasOfOperation: [],
  propertyCategories: [],
  isLicensedPractitioner: false,
  licenseNumber: "",
  professionalMemberships: [],
  bankAccountName: "",
  bankAccountNumber: "",
  bankName: "Access Bank",
  password: "",
  confirmPassword: "",
  certifiedAccurate: false,
  termsAccepted: false,
  privacyAccepted: false,
});

const AgentRegistrationForm = ({ onSubmit, loading = false, error }: Props) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [stepError, setStepError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleListItem = (key: "areasOfOperation" | "propertyCategories" | "professionalMemberships", item: string) => {
    setForm((prev) => {
      const list = prev[key];
      return {
        ...prev,
        [key]: list.includes(item)
          ? list.filter((entry) => entry !== item)
          : [...list, item],
      };
    });
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "profilePhotoDataUrl" | "idDocumentDataUrl" | "cacCertificateDataUrl",
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setStepError("Each upload must be 2 MB or smaller.");
      event.target.value = "";
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    update(field, dataUrl);
    setStepError(null);
  };

  const validateStep = (index: number): string | null => {
    switch (index) {
      case 0:
        if (!form.firstName.trim()) return "First name is required.";
        if (!form.lastName.trim()) return "Last name is required.";
        if (!form.dateOfBirth) return "Date of birth is required.";
        if (!form.nationality.trim()) return "Nationality is required.";
        if (!form.profilePhotoDataUrl) return "Profile photo is required.";
        return null;
      case 1:
        if (!form.email.trim()) return "Email is required.";
        if (!form.phone.trim()) return "Mobile phone is required.";
        if (!form.residentialAddress.trim()) return "Residential address is required.";
        if (!form.city.trim()) return "City is required.";
        if (!form.lga.trim()) return "LGA is required.";
        return null;
      case 2:
        if (!form.idDocumentDataUrl) return "Please upload your ID document.";
        return null;
      case 3:
        if (form.agentType === "company") {
          if (!form.companyName.trim()) return "Company name is required.";
          if (!form.cacRegistrationNumber.trim()) return "CAC registration number is required.";
          if (!form.cacCertificateDataUrl) return "CAC certificate upload is required.";
        }
        return null;
      case 4:
        if (form.areasOfOperation.length === 0) return "Select at least one area of operation.";
        if (form.propertyCategories.length === 0) return "Select at least one property category.";
        if (form.isLicensedPractitioner && !form.licenseNumber.trim()) {
          return "License / NIESV number is required for licensed practitioners.";
        }
        return null;
      case 5:
        if (!form.bankAccountName.trim()) return "Account name is required.";
        if (!form.bankAccountNumber.trim()) return "Account number is required.";
        if (!/^\d{10}$/.test(form.bankAccountNumber.trim())) {
          return "Account number must be 10 digits.";
        }
        if (!form.bankName.trim()) return "Bank name is required.";
        return null;
      case 6:
        if (form.password.length < 8) return "Password must be at least 8 characters.";
        if (form.password !== form.confirmPassword) return "Passwords do not match.";
        if (!form.certifiedAccurate) return "You must certify that your information is accurate.";
        if (!form.termsAccepted) return "You must accept the Terms and Conditions.";
        if (!form.privacyAccepted) return "You must accept the Privacy Policy.";
        return null;
      default:
        return null;
    }
  };

  const goNext = () => {
    const message = validateStep(step);
    if (message) {
      setStepError(message);
      return;
    }
    setStepError(null);
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setStepError(null);
    setStep((current) => Math.max(current - 1, 0));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const message = validateStep(step);
    if (message) {
      setStepError(message);
      return;
    }

    const now = new Date().toISOString();
    const registration: AgentRegistrationDetails = {
      middleName: form.middleName.trim() || undefined,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender || undefined,
      nationality: form.nationality.trim(),
      profilePhotoDataUrl: form.profilePhotoDataUrl,
      alternatePhone: form.alternatePhone.trim() || undefined,
      residentialAddress: form.residentialAddress.trim(),
      lga: form.lga.trim(),
      idDocumentType: form.idDocumentType,
      idDocumentDataUrl: form.idDocumentDataUrl,
      agentType: form.agentType,
      companyName:
        form.agentType === "company" ? form.companyName.trim() : undefined,
      cacRegistrationNumber:
        form.agentType === "company"
          ? form.cacRegistrationNumber.trim()
          : undefined,
      cacCertificateDataUrl:
        form.agentType === "company" ? form.cacCertificateDataUrl : undefined,
      yearsOfExperience: Number(form.yearsOfExperience) || 0,
      areasOfOperation: form.areasOfOperation,
      propertyCategories: form.propertyCategories,
      isLicensedPractitioner: form.isLicensedPractitioner,
      professionalMemberships: form.professionalMemberships,
      bankAccountName: form.bankAccountName.trim(),
      bankAccountNumber: form.bankAccountNumber.trim(),
      bankName: form.bankName.trim(),
      certifiedAccurateAt: now,
      termsAcceptedAt: now,
      privacyAcceptedAt: now,
    };

    await onSubmit({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
      agencyName:
        form.agentType === "company"
          ? form.companyName.trim()
          : "Independent Agent",
      licenseNumber: form.licenseNumber.trim(),
      city: form.city.trim(),
      state: form.state,
      registration,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-4">
        <h4 className="mb-1">Property Agent Registration</h4>
        <p className="text-muted fs-14 mb-3">
          Complete all sections so Dueno can verify your identity and approve your
          agent account.
        </p>
        <div className="d-flex flex-wrap gap-2">
          {STEPS.map((label, index) => (
            <span
              key={label}
              className={`badge ${index === step ? "bg-primary" : index < step ? "bg-success" : "bg-light text-dark"}`}
            >
              {index + 1}. {label}
            </span>
          ))}
        </div>
      </div>

      {(error || stepError) && (
        <div className="alert alert-danger py-2">{error ?? stepError}</div>
      )}

      {step === 0 && (
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">First name *</label>
            <input
              className="form-control"
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Last name *</label>
            <input
              className="form-control"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Middle name</label>
            <input
              className="form-control"
              value={form.middleName}
              onChange={(e) => update("middleName", e.target.value)}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Date of birth *</label>
            <input
              type="date"
              className="form-control"
              value={form.dateOfBirth}
              onChange={(e) => update("dateOfBirth", e.target.value)}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Gender</label>
            <select
              className="form-select"
              value={form.gender}
              onChange={(e) =>
                update("gender", e.target.value as FormState["gender"])
              }
            >
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Nationality *</label>
            <input
              className="form-control"
              value={form.nationality}
              onChange={(e) => update("nationality", e.target.value)}
              required
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label">Profile photo (passport photograph) *</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => void handleFileUpload(e, "profilePhotoDataUrl")}
            />
            {form.profilePhotoDataUrl && (
              <img
                src={form.profilePhotoDataUrl}
                alt="Profile preview"
                className="mt-2 rounded"
                style={{ width: 96, height: 96, objectFit: "cover" }}
              />
            )}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Email address *</label>
            <input
              type="email"
              className="form-control"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Mobile phone *</label>
            <input
              className="form-control"
              placeholder="+234..."
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Alternative phone</label>
            <input
              className="form-control"
              value={form.alternatePhone}
              onChange={(e) => update("alternatePhone", e.target.value)}
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label">Residential address *</label>
            <textarea
              className="form-control"
              rows={2}
              value={form.residentialAddress}
              onChange={(e) => update("residentialAddress", e.target.value)}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">State of residence *</label>
            <select
              className="form-select"
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
            >
              {NIGERIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">City *</label>
            <input
              className="form-control"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              required
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">LGA *</label>
            <input
              className="form-control"
              value={form.lga}
              onChange={(e) => update("lga", e.target.value)}
              required
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Means of identification *</label>
            <select
              className="form-select"
              value={form.idDocumentType}
              onChange={(e) =>
                update("idDocumentType", e.target.value as IdDocumentType)
              }
            >
              {(Object.keys(ID_DOCUMENT_LABELS) as IdDocumentType[]).map((key) => (
                <option key={key} value={key}>
                  {ID_DOCUMENT_LABELS[key]}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 mb-3">
            <label className="form-label">Upload ID document *</label>
            <input
              type="file"
              className="form-control"
              accept="image/*,application/pdf"
              onChange={(e) => void handleFileUpload(e, "idDocumentDataUrl")}
            />
            {form.idDocumentDataUrl && !form.idDocumentDataUrl.includes("application/pdf") && (
              <img
                src={form.idDocumentDataUrl}
                alt="ID preview"
                className="mt-2 rounded border"
                style={{ maxHeight: 180 }}
              />
            )}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="row">
          <div className="col-12 mb-3">
            <label className="form-label d-block">Agent type *</label>
            <div className="btn-group w-100" role="group">
              <button
                type="button"
                className={`btn ${form.agentType === "individual" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => update("agentType", "individual")}
              >
                Individual Agent
              </button>
              <button
                type="button"
                className={`btn ${form.agentType === "company" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => update("agentType", "company")}
              >
                Real Estate Company
              </button>
            </div>
          </div>
          {form.agentType === "company" && (
            <>
              <div className="col-md-6 mb-3">
                <label className="form-label">Company name *</label>
                <input
                  className="form-control"
                  value={form.companyName}
                  onChange={(e) => update("companyName", e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">CAC registration number *</label>
                <input
                  className="form-control"
                  value={form.cacRegistrationNumber}
                  onChange={(e) => update("cacRegistrationNumber", e.target.value)}
                />
              </div>
              <div className="col-12 mb-3">
                <label className="form-label">Upload CAC certificate *</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*,application/pdf"
                  onChange={(e) => void handleFileUpload(e, "cacCertificateDataUrl")}
                />
              </div>
            </>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Years of experience</label>
            <input
              type="number"
              min={0}
              className="form-control"
              value={form.yearsOfExperience}
              onChange={(e) => update("yearsOfExperience", e.target.value)}
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label">Areas of operation *</label>
            <div className="d-flex flex-wrap gap-2">
              {AGENT_OPERATION_AREAS.map((area) => (
                <button
                  key={area}
                  type="button"
                  className={`btn btn-sm ${form.areasOfOperation.includes(area) ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => toggleListItem("areasOfOperation", area)}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
          <div className="col-12 mb-3">
            <label className="form-label">Property categories handled *</label>
            <div className="d-flex flex-wrap gap-2">
              {AGENT_PROPERTY_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`btn btn-sm ${form.propertyCategories.includes(category) ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => toggleListItem("propertyCategories", category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="licensed-practitioner"
                checked={form.isLicensedPractitioner}
                onChange={(e) => update("isLicensedPractitioner", e.target.checked)}
              />
              <label className="form-check-label" htmlFor="licensed-practitioner">
                I am a licensed real estate practitioner
              </label>
            </div>
          </div>
          {form.isLicensedPractitioner && (
            <div className="col-md-6 mb-3">
              <label className="form-label">NIESV / license number *</label>
              <input
                className="form-control"
                value={form.licenseNumber}
                onChange={(e) => update("licenseNumber", e.target.value)}
              />
            </div>
          )}
          <div className="col-12 mb-3">
            <label className="form-label">Professional memberships (optional)</label>
            <div className="d-flex flex-column gap-2">
              {PROFESSIONAL_MEMBERSHIPS.map((membership) => (
                <div className="form-check" key={membership}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`membership-${membership}`}
                    checked={form.professionalMemberships.includes(membership)}
                    onChange={() =>
                      toggleListItem("professionalMemberships", membership)
                    }
                  />
                  <label className="form-check-label" htmlFor={`membership-${membership}`}>
                    {membership}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Account name *</label>
            <input
              className="form-control"
              value={form.bankAccountName}
              onChange={(e) => update("bankAccountName", e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Account number *</label>
            <input
              className="form-control"
              inputMode="numeric"
              maxLength={10}
              value={form.bankAccountNumber}
              onChange={(e) => update("bankAccountNumber", e.target.value.replace(/\D/g, ""))}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Bank name *</label>
            <select
              className="form-select"
              value={form.bankName}
              onChange={(e) => update("bankName", e.target.value)}
            >
              {NIGERIAN_BANKS.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Password *</label>
            <div className="position-relative form-cover password">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control pass-input"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
              />
              <span
                className={`fas toggle-password text-dark fs-12 ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
                onClick={() => setShowPassword((value) => !value)}
              />
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Confirm password *</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              value={form.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
            />
          </div>
          <div className="col-12 mb-2">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="certify-accurate"
                checked={form.certifiedAccurate}
                onChange={(e) => update("certifiedAccurate", e.target.checked)}
              />
              <label className="form-check-label" htmlFor="certify-accurate">
                I certify that all information provided is accurate.
              </label>
            </div>
          </div>
          <div className="col-12 mb-2">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="terms-accepted"
                checked={form.termsAccepted}
                onChange={(e) => update("termsAccepted", e.target.checked)}
              />
              <label className="form-check-label" htmlFor="terms-accepted">
                I agree to the Terms and Conditions.
              </label>
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="privacy-accepted"
                checked={form.privacyAccepted}
                onChange={(e) => update("privacyAccepted", e.target.checked)}
              />
              <label className="form-check-label" htmlFor="privacy-accepted">
                I agree to the Privacy Policy.
              </label>
            </div>
          </div>
          <div className="col-12">
            <p className="text-muted fs-13 mb-0">
              Your application will be reviewed by Dueno admin before you can list
              properties.
            </p>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          type="button"
          className="btn btn-light"
          onClick={goBack}
          disabled={step === 0 || loading}
        >
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button type="button" className="btn btn-primary" onClick={goNext}>
            Continue
          </button>
        ) : (
          <button type="submit" className="btn btn-lg btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        )}
      </div>

      <div className="text-center mt-4">
        <h6 className="fw-normal fs-14 text-dark mb-0">
          Already have an account?{" "}
          <Link to={all_routes.signin} className="register-btn">
            Sign In
          </Link>
        </h6>
      </div>
    </form>
  );
};

export default AgentRegistrationForm;
