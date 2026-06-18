import { useState } from "react";
import { Link, useNavigate } from "react-router";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import { all_routes } from "../../../routes/all_routes";
import { useAuth } from "../../../../context/AuthContext";

type PasswordField = "password" | "confirmPassword";

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const redirectTo = await login(email.trim(), password);
    setLoading(false);
    if (redirectTo) {
      navigate(redirectTo);
      return;
    }
    setError("Invalid email or password.");
  };

  return (
    <>
      <div className="container-fuild position-relative z-1">
        <div className="w-100 overflow-hidden position-relative flex-wrap d-block vh-100 sign-">
          <div className="row justify-content-center align-items-center vh-100 overflow-auto flex-wrap py-3">
            <div className="col-md-8 col-lg-6 col-xl-4 mx-auto">
              <form
                className="d-flex justify-content-center align-items-center"
                onSubmit={handleSubmit}
              >
                <div className="d-flex flex-column justify-content-lg-center p-4 p-lg-0 pb-0 flex-fill">
                  <div className=" mx-auto mb-4 text-center">
                    <ImageWithBasePath
                      src="assets/img/logo.svg"
                      className="img-fluid"
                      alt="Logo"
                    />
                  </div>
                  <div>
                    <div className="login-item-01">
                      <h4>Hey There! Welcome Back</h4>
                      {error && (
                        <div className="alert alert-danger py-2">{error}</div>
                      )}
                      <div>
                        <div className="mb-3">
                          <label className="form-label">
                            Email<span className="text-danger ms-1">*</span>
                          </label>
                          <div className="form-cover">
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Enter your email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
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
                                passwordVisibility.password
                                  ? "text"
                                  : "password"
                              }
                              className="pass-input form-control"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
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
                            ></span>
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
                          <div className="d-flex align-items-center">
                            <div className="form-check form-check-md mb-0">
                              <input
                                className="form-check-input"
                                id="remember_me"
                                type="checkbox"
                              />
                              <label htmlFor="remember_me" className="mt-0">
                                Remember Me
                              </label>
                            </div>
                          </div>
                          <div className="text-end">
                            <Link
                              to={all_routes.forgotPassword}
                              className="text-danger"
                            >
                              Forgot Password?
                            </Link>
                          </div>
                        </div>
                        <div className="mb-3">
                          <button
                            type="submit"
                            className="btn btn-lg bg-primary text-white w-100"
                            disabled={loading}
                          >
                            {loading ? "Signing in..." : "Sign In"}
                          </button>
                        </div>
                        <div className="text-center">
                          <h6 className="fw-normal fs-14 text-dark mb-0">
                            Don&apos;t have an account yet?
                            <Link
                              to={all_routes.signup}
                              className="register-btn"
                            >
                              {" "}
                              Register
                            </Link>
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
