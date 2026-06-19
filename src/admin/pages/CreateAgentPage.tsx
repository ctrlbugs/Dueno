import { useState } from "react";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import AdminPageBreadcrumb from "../components/AdminPageBreadcrumb";
import { createAgent } from "../services/agentStore";
import type { AgentStatus } from "../types";
import {
  AGENT_SOCIAL_FIELDS,
  normalizeSocialLinks,
} from "../../types/agentSocial";

type CreateAgentForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  agencyName: string;
  licenseNumber: string;
  city: string;
  state: string;
  status: AgentStatus;
  notes: string;
  bio: string;
  socialX: string;
  socialInstagram: string;
  socialLinkedin: string;
  socialTiktok: string;
  socialFacebook: string;
  socialYoutube: string;
};

const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  phone: yup
    .string()
    .required("Phone is required")
    .min(10, "Enter a valid phone number"),
  password: yup
    .string()
    .required("Temporary password is required")
    .min(8, "Password must be at least 8 characters"),
  agencyName: yup.string().required("Agency name is required"),
  licenseNumber: yup.string().required("NIESV / license number is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  status: yup
    .mixed<AgentStatus>()
    .oneOf(["pending_review", "approved", "rejected", "suspended"])
    .required(),
  notes: yup.string().default(""),
  bio: yup.string().default(""),
  socialX: yup.string().default(""),
  socialInstagram: yup.string().default(""),
  socialLinkedin: yup.string().default(""),
  socialTiktok: yup.string().default(""),
  socialFacebook: yup.string().default(""),
  socialYoutube: yup.string().default(""),
});

const CreateAgentPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateAgentForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      agencyName: "",
      licenseNumber: "",
      city: "",
      state: "Lagos",
      status: "approved",
      notes: "",
      bio: "",
      socialX: "",
      socialInstagram: "",
      socialLinkedin: "",
      socialTiktok: "",
      socialFacebook: "",
      socialYoutube: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setSuccess(null);
    try {
      const {
        bio,
        socialX,
        socialInstagram,
        socialLinkedin,
        socialTiktok,
        socialFacebook,
        socialYoutube,
        ...agentValues
      } = values;

      const agent = createAgent({
        ...agentValues,
        createdBy: "admin",
        bio: bio.trim() || undefined,
        socialLinks: normalizeSocialLinks({
          x: socialX,
          instagram: socialInstagram,
          linkedin: socialLinkedin,
          tiktok: socialTiktok,
          facebook: socialFacebook,
          youtube: socialYoutube,
        }),
      });
      setSuccess(
        `Agent account created for ${agent.firstName} ${agent.lastName}. They can sign in with ${agent.email}.`
      );
      reset();
      setTimeout(() => navigate("/admin/agents"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create agent.");
    }
  });

  return (
    <>
      <AdminPageBreadcrumb title="Create Agent" subName="Agents" />

      <Row>
        <Col xl={8}>
          <Card>
            <Card.Body>
              <h4 className="header-title mb-1">New Agent Account</h4>
              <p className="text-muted mb-4">
                Create an agent profile with login credentials. Approved agents
                can access the agent dashboard once it is launched.
              </p>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={onSubmit} noValidate>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First name</Form.Label>
                      <Form.Control
                        {...register("firstName")}
                        isInvalid={Boolean(errors.firstName)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.firstName?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last name</Form.Label>
                      <Form.Control
                        {...register("lastName")}
                        isInvalid={Boolean(errors.lastName)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.lastName?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        {...register("email")}
                        isInvalid={Boolean(errors.email)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        {...register("phone")}
                        placeholder="+234..."
                        isInvalid={Boolean(errors.phone)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phone?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Agency name</Form.Label>
                      <Form.Control
                        {...register("agencyName")}
                        isInvalid={Boolean(errors.agencyName)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.agencyName?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>NIESV / license number</Form.Label>
                      <Form.Control
                        {...register("licenseNumber")}
                        placeholder="NIESV-2024-001"
                        isInvalid={Boolean(errors.licenseNumber)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.licenseNumber?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        {...register("city")}
                        isInvalid={Boolean(errors.city)}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.city?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>State</Form.Label>
                      <Form.Select
                        {...register("state")}
                        isInvalid={Boolean(errors.state)}
                      >
                        {NIGERIAN_STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.state?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Temporary password</Form.Label>
                      <Form.Control
                        type="password"
                        {...register("password")}
                        isInvalid={Boolean(errors.password)}
                      />
                      <Form.Text className="text-muted">
                        Share this securely with the agent. They should change
                        it on first login.
                      </Form.Text>
                      <Form.Control.Feedback type="invalid">
                        {errors.password?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Account status</Form.Label>
                      <Form.Select {...register("status")}>
                        <option value="approved">Approved — can list</option>
                        <option value="pending_review">Pending review</option>
                        <option value="suspended">Suspended</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Internal notes (optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    {...register("notes")}
                    placeholder="Compliance notes, referral source, etc."
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Public bio (optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    {...register("bio")}
                    placeholder="Shown on the agent list and public profile."
                  />
                </Form.Group>

                <h5 className="mb-3">Social profiles (optional)</h5>
                <Row>
                  {AGENT_SOCIAL_FIELDS.map(({ key, label, placeholder }) => {
                    const fieldName = {
                      x: "socialX",
                      instagram: "socialInstagram",
                      linkedin: "socialLinkedin",
                      tiktok: "socialTiktok",
                      facebook: "socialFacebook",
                      youtube: "socialYoutube",
                    }[key] as keyof CreateAgentForm;

                    return (
                      <Col md={6} key={key}>
                        <Form.Group className="mb-3">
                          <Form.Label>{label}</Form.Label>
                          <Form.Control
                            type="url"
                            {...register(fieldName)}
                            placeholder={placeholder}
                          />
                        </Form.Group>
                      </Col>
                    );
                  })}
                </Row>

                <div className="d-flex gap-2">
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Agent"}
                  </Button>
                  <Link to="/admin/agents" className="btn btn-light">
                    Cancel
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={4}>
          <Card className="bg-primary text-white">
            <Card.Body>
              <h4 className="text-white">Admin-created agents</h4>
              <p className="mb-0 opacity-75">
                Use this when onboarding vetted agents directly. Self-signup
                applications appear in the Applications queue for review.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CreateAgentPage;
