import { useState } from "react";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import { all_routes } from "../../../routes/all_routes";
import { Link, useNavigate } from "react-router";
import { createAgent } from "../../../../services/agentStore";
import { createBuyer } from "../../../../services/buyerStore";
import { login } from "../../../../services/authService";
import AgentRegistrationForm from "../../../../shared/components/AgentRegistrationForm";

type PasswordField = "password" | "confirmPassword";
type AccountType = "buyer" | "agent";

const SignUp = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<AccountType>("buyer");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const [buyerForm, setBuyerForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleBuyerSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (buyerForm.password !== buyerForm.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (buyerForm.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      createBuyer({
        firstName: buyerForm.firstName.trim(),
        lastName: buyerForm.lastName.trim(),
        email: buyerForm.email.trim(),
        password: buyerForm.password,
      });

      const result = login(buyerForm.email.trim(), buyerForm.password);
      setLoading(false);
      if (result) {
        navigate(result.redirectTo);
        return;
      }
      navigate(all_routes.signin);
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Sign up failed.");
    }
  };

  const handleAgentSubmit = async (
    values: Parameters<
      React.ComponentProps<typeof AgentRegistrationForm>["onSubmit"]
    >[0],
  ) => {
    setError(null);
    setLoading(true);
    try {
      createAgent({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        agencyName: values.agencyName,
        licenseNumber: values.licenseNumber,
        city: values.city,
        state: values.state,
        status: "pending_review",
        createdBy: "self",
        registration: values.registration,
        avatarDataUrl: values.registration.profilePhotoDataUrl,
      });

      const result = login(values.email, values.password);
      setLoading(false);
      if (result) {
        navigate(result.redirectTo);
        return;
      }
      navigate(all_routes.signin);
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Sign up failed.");
    }
  };

  return (
    <>
      <div className="container-fuild position-relative z-1">
        <div className="w-100 overflow-hidden position-relative flex-wrap d-block min-vh-100 sign-">
          <div className="row justify-content-center align-items-start min-vh-100 overflow-auto flex-wrap py-4">
            <div
              className={
                accountType === "agent"
                  ? "col-md-11 col-lg-10 col-xl-9 mx-auto"
                  : "col-md-10 col-lg-7 col-xl-5 mx-auto"
              }
            >
              <div className="d-flex justify-content-center align-items-center">
                <div className="d-flex flex-column justify-content-lg-center p-4 p-lg-0 pb-0 flex-fill w-100">
                  <div className="mx-auto mb-4 text-center">
                    <ImageWithBasePath
                      src="assets/img/logo.svg"
                      className="img-fluid"
                      alt="Logo"
                    />
                  </div>
                  <div className="login-item-01">
                    <h4>Create Your Dueno Account</h4>
                    <div className="mb-4">
                      <label className="form-label d-block mb-2">
                        I want to register as
                      </label>
                      <div className="btn-group w-100" role="group">
                        <button
                          type="button"
                          className={`btn ${accountType === "buyer" ? "btn-primary" : "btn-outline-primary"}`}
                          onClick={() => {
                            setAccountType("buyer");
                            setError(null);
                          }}
                        >
                          Buyer
                        </button>
                        <button
                          type="button"
                          className={`btn ${accountType === "agent" ? "btn-primary" : "btn-outline-primary"}`}
                          onClick={() => {
                            setAccountType("agent");
                            setError(null);
                          }}
                        >
                          Agent
                        </button>
                      </div>
                    </div>

                    {accountType === "buyer" ? (
                      <form onSubmit={handleBuyerSubmit}>
                        {error && (
                          <div className="alert alert-danger py-2">{error}</div>
                        )}
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label">
                              First name<span className="text-danger ms-1">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={buyerForm.firstName}
                              onChange={(e) =>
                                setBuyerForm({
                                  ...buyerForm,
                                  firstName: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">
                              Last name<span className="text-danger ms-1">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={buyerForm.lastName}
                              onChange={(e) =>
                                setBuyerForm({
                                  ...buyerForm,
                                  lastName: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">
                            Email<span className="text-danger ms-1">*</span>
                          </label>
                          <div className="form-cover">
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Enter your email"
                              value={buyerForm.email}
                              onChange={(e) =>
                                setBuyerForm({
                                  ...buyerForm,
                                  email: e.target.value,
                                })
                              }
                              required
                            />
                            <i className="material-icons-outlined">mail</i>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">
                            Password<span className="text-danger ms-1">*</span>
                          </label>
                          <div className="position-relative form-cover password">
                            <input
                              type={
                                passwordVisibility.password ? "text" : "password"
                              }
                              className="pass-input form-control"
                              value={buyerForm.password}
                              onChange={(e) =>
                                setBuyerForm({
                                  ...buyerForm,
                                  password: e.target.value,
                                })
                              }
                              required
                            />
                            <i className="material-icons-outlined">lock</i>
                            <span
                              className={`fas toggle-password text-dark fs-12 ${
                                passwordVisibility.password
                                  ? "fa-eye"
                                  : "fa-eye-slash"
                              }`}
                              onClick={() =>
                                togglePasswordVisibility("password")
                              }
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">
                            Confirm Password
                            <span className="text-danger ms-1">*</span>
                          </label>
                          <div className="position-relative form-cover password">
                            <input
                              type={
                                passwordVisibility.confirmPassword
                                  ? "text"
                                  : "password"
                              }
                              className="pass-input form-control"
                              value={buyerForm.confirmPassword}
                              onChange={(e) =>
                                setBuyerForm({
                                  ...buyerForm,
                                  confirmPassword: e.target.value,
                                })
                              }
                              required
                            />
                            <i className="material-icons-outlined">lock</i>
                            <span
                              className={`fas toggle-password text-dark fs-12 ${
                                passwordVisibility.confirmPassword
                                  ? "fa-eye"
                                  : "fa-eye-slash"
                              }`}
                              onClick={() =>
                                togglePasswordVisibility("confirmPassword")
                              }
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <button
                            type="submit"
                            className="btn btn-lg bg-primary text-white w-100"
                            disabled={loading}
                          >
                            {loading ? "Creating account..." : "Sign Up"}
                          </button>
                        </div>
                        <div className="text-center">
                          <h6 className="fw-normal fs-14 text-dark mb-0">
                            Already have an account?{" "}
                            <Link to={all_routes.signin} className="register-btn">
                              Sign In
                            </Link>
                          </h6>
                        </div>
                      </form>
                    ) : (
                      <AgentRegistrationForm
                        onSubmit={handleAgentSubmit}
                        loading={loading}
                        error={error}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
