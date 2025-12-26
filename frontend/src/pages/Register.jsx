import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import PasswordInput from "../components/PasswordInput";
import Button from "../components/Button";
import RateLimtedUi from "../components/RateLimtedUi";
import { registerUser } from "../api/auth";

const Register = () => {
  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // field errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // global/server error
  const [serverError, setServerError] = useState("");
  const [rateLimited, setRateLimited] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    // reset errors
    setEmailError("");
    setPasswordError("");
    setServerError("");
    setRateLimited(false);

    // client-side required checks
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    if (!password.trim()) {
      setPasswordError("Password is required");
      return;
    }

    try {
      setLoading(true);
      await registerUser(email, password);
      navigate("/login");
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      // RATE LIMIT
      if (status === 429) {
        setRateLimited(true);
        return;
      }

    if (status === 400 && Array.isArray(data?.errors)) {
  data.errors.forEach((e) => {
    const field = e.path?.[0];
    if (field === "email") setEmailError(e.message);
    if (field === "password") setPasswordError(e.message);
  });
  return;
}

      // OTHER SERVER ERRORS
      setServerError(data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // FULL PAGE RATE LIMIT UI
  if (rateLimited) {
    return <RateLimtedUi />;
  }

 return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 px-4">

    {/* APP HEADING */}
    <div className="mb-6 text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
        <span className="text-primary">Note-It</span> 📝
      </h1>
      <p className="mt-2 text-sm sm:text-base opacity-70">
        Capture your thoughts. Anytime. Anywhere.
      </p>
    </div>

    {/* REGISTER CARD */}
    <div className="card w-full flex flex-col items-center justify-center max-w-md bg-base-100 shadow-xl p-4 gap-4 mt-3">
      <h2 className="text-2xl font-bold text-center">Create Account</h2>

      {/* GLOBAL ERROR */}
      {serverError && (
        <div className="alert alert-error text-sm">
          {serverError}
        </div>
      )}

      {/* EMAIL */}
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        error={emailError}
        onChange={(e) => {
          setEmail(e.target.value);
          setEmailError("");
        }}
      />

      {/* PASSWORD */}
      <PasswordInput
        label="Password"
        placeholder="Enter password"
        value={password}
        error={passwordError}
        onChange={(e) => {
          setPassword(e.target.value);
          setPasswordError("");
        }}
      />

      {/* BUTTON */}
      <Button
        text={loading ? "Registering..." : "Register"}
        onClick={handleRegister}
        disabled={loading}
      />

      <p className="text-sm text-center mb-3">
        Already have an account?{" "}
        <Link to="/login" className="link link-primary font-medium">
          Login
        </Link>
      </p>
    </div>
  </div>
);

};

export default Register;
