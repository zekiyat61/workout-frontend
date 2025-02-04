import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";
import { useSnackbar } from "notistack";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const handleLogin = () => {
    setLoading(true);
    axios
      .post(`${import.meta.env.VITE_SERVER_URL}/user/login`, {
        email,
        password,
      })
      .then((res) => {
        const { token, email } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", email);

        setLoading(true);

        enqueueSnackbar("Login Successfully", {
          variant: "success",
        });
        navigate("/home", { state: { email } });
      })
      .catch((error) => {
        console.log("Error Response", error.res);
        if (error.response?.status === 403) {
          enqueueSnackbar(error.response.data.message, {
            variant: "warning",
          });
        } else if (error.response?.status === 401) {
          enqueueSnackbar("Invalid credentials. Please try again.", {
            variant: "error",
          });
        } else {
          // Notify user of unexpected errors
          enqueueSnackbar("An error occurred. Please try again later.", {
            variant: "error",
          });
        }
        setLoading(false);
      });
  };
  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{ backgroundColor: "var(--light-bg)" }}
    >
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <h1
            className="navbar-brand mb-0 fw-bold"
            style={{ color: "var(--primary-color)" }}
          >
            MY WORKOUT GYM
          </h1>
          <div className="d-flex gap-3">
            <Link
              to="/"
              className="btn rounded-pill px-4"
              style={{
                backgroundColor: "var(--primary-color)",
                color: "white",
              }}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="btn rounded-pill px-4"
              style={{
                border: "2px solid var(--secondary-color)",
                color: "var(--secondary-color)",
              }}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <div className="container my-auto py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border-0 shadow-lg">
              <div className="card-body p-5">
                <h2
                  className="card-title text-center mb-4"
                  style={{ color: "var(--text-dark)" }}
                >
                  Welcome Back
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                  }}
                >
                  <div className="mb-4">
                    <label
                      className="form-label"
                      style={{ color: "var(--secondary-color)" }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control form-control-lg"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      className="form-label"
                      style={{ color: "var(--secondary-color)" }}
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control form-control-lg"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-custom btn-lg w-100 mb-4"
                    style={{
                      backgroundColor: "blue",
                      color: "white",
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                      />
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>

                <div
                  className="text-center"
                  style={{ color: "var(--secondary-color)" }}
                >
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="fw-semibold text-decoration-none"
                    style={{ color: "var(--primary-color)" }}
                  >
                    Create one
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
