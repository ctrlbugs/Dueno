import type { AgentUser } from "../../types/user";
import { ID_DOCUMENT_LABELS } from "../../types/agentRegistration";

type DetailRow = { label: string; value?: string | number | boolean | null };

const DetailSection = ({
  title,
  rows,
}: {
  title: string;
  rows: DetailRow[];
}) => (
  <div className="mb-4">
    <h6 className="text-uppercase text-muted fs-12 fw-semibold mb-3">{title}</h6>
    <div className="row g-2">
      {rows.map((row) => (
        <div className="col-md-6" key={row.label}>
          <div className="border rounded p-2 h-100">
            <div className="text-muted fs-12">{row.label}</div>
            <div className="fw-medium">
              {row.value === undefined || row.value === null || row.value === ""
                ? "—"
                : typeof row.value === "boolean"
                  ? row.value
                    ? "Yes"
                    : "No"
                  : String(row.value)}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DocumentPreview = ({
  label,
  dataUrl,
}: {
  label: string;
  dataUrl?: string;
}) => {
  if (!dataUrl) {
    return (
      <div className="col-md-4">
        <div className="border rounded p-2 text-muted fs-13">{label}: Not uploaded</div>
      </div>
    );
  }

  const isPdf = dataUrl.startsWith("data:application/pdf");

  return (
    <div className="col-md-4">
      <div className="border rounded p-2">
        <div className="text-muted fs-12 mb-2">{label}</div>
        {isPdf ? (
          <a href={dataUrl} download className="btn btn-sm btn-soft-primary">
            Download PDF
          </a>
        ) : (
          <img
            src={dataUrl}
            alt={label}
            className="img-fluid rounded"
            style={{ maxHeight: 160, objectFit: "cover" }}
          />
        )}
      </div>
    </div>
  );
};

type Props = {
  agent: AgentUser;
};

const AgentApplicationDetailView = ({ agent }: Props) => {
  const reg = agent.registration;

  return (
    <div>
      <DetailSection
        title="Account"
        rows={[
          { label: "Full name", value: `${agent.firstName} ${reg?.middleName ? `${reg.middleName} ` : ""}${agent.lastName}` },
          { label: "Email", value: agent.email },
          { label: "Status", value: agent.status.replace("_", " ") },
          { label: "Applied", value: new Date(agent.createdAt).toLocaleString() },
          { label: "Source", value: agent.createdBy === "admin" ? "Admin created" : "Self registration" },
        ]}
      />

      {reg ? (
        <>
          <DetailSection
            title="Personal Information"
            rows={[
              { label: "First name", value: agent.firstName },
              { label: "Last name", value: agent.lastName },
              { label: "Middle name", value: reg.middleName },
              { label: "Date of birth", value: reg.dateOfBirth },
              { label: "Gender", value: reg.gender?.replace("_", " ") },
              { label: "Nationality", value: reg.nationality },
            ]}
          />

          <DetailSection
            title="Contact Information"
            rows={[
              { label: "Mobile phone", value: agent.phone },
              { label: "Alternative phone", value: reg.alternatePhone },
              { label: "Residential address", value: reg.residentialAddress },
              { label: "State of residence", value: agent.state },
              { label: "City", value: agent.city },
              { label: "LGA", value: reg.lga },
            ]}
          />

          <DetailSection
            title="Identity Verification (KYC)"
            rows={[
              {
                label: "Means of identification",
                value: ID_DOCUMENT_LABELS[reg.idDocumentType],
              },
            ]}
          />
          <div className="row g-3 mb-4">
            <DocumentPreview label="Profile photo" dataUrl={reg.profilePhotoDataUrl} />
            <DocumentPreview label="ID document" dataUrl={reg.idDocumentDataUrl} />
          </div>

          <DetailSection
            title="Business Information"
            rows={[
              {
                label: "Agent type",
                value:
                  reg.agentType === "company"
                    ? "Real Estate Company"
                    : "Individual Agent",
              },
              { label: "Agency / company name", value: reg.companyName ?? agent.agencyName },
              { label: "CAC registration number", value: reg.cacRegistrationNumber },
              { label: "NIESV / license number", value: agent.licenseNumber },
            ]}
          />
          {reg.agentType === "company" && (
            <div className="row g-3 mb-4">
              <DocumentPreview
                label="CAC certificate"
                dataUrl={reg.cacCertificateDataUrl}
              />
            </div>
          )}

          <DetailSection
            title="Professional Information"
            rows={[
              { label: "Years of experience", value: reg.yearsOfExperience },
              {
                label: "Areas of operation",
                value: reg.areasOfOperation.join(", "),
              },
              {
                label: "Property categories",
                value: reg.propertyCategories.join(", "),
              },
              {
                label: "Licensed real estate practitioner",
                value: reg.isLicensedPractitioner,
              },
              {
                label: "Professional memberships",
                value: reg.professionalMemberships.length
                  ? reg.professionalMemberships.join(", ")
                  : "None listed",
              },
            ]}
          />

          <DetailSection
            title="Bank Information"
            rows={[
              { label: "Account name", value: reg.bankAccountName },
              { label: "Account number", value: reg.bankAccountNumber },
              { label: "Bank name", value: reg.bankName },
            ]}
          />

          <DetailSection
            title="Legal Agreements"
            rows={[
              {
                label: "Information certified accurate",
                value: Boolean(reg.certifiedAccurateAt),
              },
              {
                label: "Terms & conditions accepted",
                value: Boolean(reg.termsAcceptedAt),
              },
              {
                label: "Privacy policy accepted",
                value: Boolean(reg.privacyAcceptedAt),
              },
            ]}
          />
        </>
      ) : (
        <>
          <div className="alert alert-warning">
            This agent was registered before the expanded registration form. Only
            basic profile fields are available below.
          </div>
          <DetailSection
            title="Basic Profile"
            rows={[
              { label: "Phone", value: agent.phone },
              { label: "Agency", value: agent.agencyName },
              { label: "License", value: agent.licenseNumber },
              { label: "Location", value: `${agent.city}, ${agent.state}` },
            ]}
          />
        </>
      )}

      {agent.notes && (
        <DetailSection title="Admin Notes" rows={[{ label: "Notes", value: agent.notes }]} />
      )}
    </div>
  );
};

export default AgentApplicationDetailView;
