import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { registerUser } from "../api/auth";
import RateLimtedUi from './../components/RateLimtedUi';
import { useNavigate } from 'react-router';
import PasswordInput from "../components/PasswordInput";
const Register = () => {
  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // local validation errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // backend/global error
  const [serverError, setServerError] = useState("");

  // rate limit flag
  const [rateLimited, setRateLimited] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    // reset errors
    setEmailError("");
    setPasswordError("");
    setServerError("");

    // simple validation
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    try {
      const { data } = await registerUser(email, password);
      navigate("/login");
    } catch (err) {
      const status = err.response?.status;

      // RATE LIMIT HANDLING
      if (status === 429) {
        setRateLimited(true);
        return;
      }

      // BACKEND ERROR MESSAGE
      setServerError(err.response?.data?.message || "Registration failed");
    }
  };

  // SHOW RATE LIMIT UI
  if (rateLimited) {
    return <RateLimtedUi />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">

      <h1 className="text-3xl font-bold">Register</h1>

      {/* GLOBAL SERVER ERROR */}
      {serverError && (
        <p className="text-red-500 font-semibold">{serverError}</p>
      )}

      {/* EMAIL INPUT */}
 <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        error={emailError}
        onChange={(e) => setEmail(e.target.value)}
      />

     
      <PasswordInput
            label="Password"
            value={password}
        placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
          />



      {/* BUTTON */}
      <Button text="Register" onClick={handleRegister} />
    </div>
  );
};

export default Register;
