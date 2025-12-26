import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Input from "../components/Input";
import PasswordInput from "../components/PasswordInput";
import Button from "../components/Button";
import { loginUser } from "../api/auth";
import RateLimitedUi from "../components/RateLimtedUi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const [rateLimited, setRateLimited] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    // reset state
    setEmailError("");
    setPasswordError("");
    setServerError("");
    setRateLimited(false);

    // client-side validation
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    try {
      setLoading(true);
      await loginUser(email, password);
      navigate("/");
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      // RATE LIMIT
      if (status === 429) {
        setRateLimited(true);
        return;
      }

      // ZOD FIELD ERRORS (400)
      // ZOD EMAIL ERRORS ONLY
      if (status === 400 && Array.isArray(data?.errors)) {
        data.errors.forEach((e) => {
          if (e.path?.[0] === "email") {
            setEmailError(e.message);
          }
        });
        return;
      }

      // AUTH ERROR
      if (status === 401) {
        setServerError("Invalid email or password");
        return;
      }

      // FALLBACK
      setServerError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-base-200">
       {/* APP HEADING */}
    <div className="mb-6 text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
        <span className="text-primary">Note-It</span> 📝
      </h1>
      <p className="mt-2 text-sm sm:text-base opacity-70">
        Capture your thoughts. Anytime. Anywhere.
      </p>
    </div>
    
      <div className="card w-full flex flex-col items-center justify-center max-w-md bg-base-100 shadow-xl p-4 gap-4">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        {rateLimited && <RateLimitedUi />}

        {serverError && (
          <div className="alert alert-error text-sm">{serverError}</div>
        )}

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          error={emailError}
          onChange={(e) => {
            setEmail(e.target.value);
            setRateLimited(false);
          }}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setRateLimited(false);
          }}
          error={passwordError}
        />

        <Button
          text={
            rateLimited
              ? "Too many attempts"
              : loading
              ? "Logging in..."
              : "Login"
          }
          onClick={handleLogin}
          disabled={loading || rateLimited}
        />

        <p className="text-sm text-center mb-3">
          Don’t have an account?{" "}
          <Link to="/register" className="link link-primary font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
