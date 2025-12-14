import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate } from "react-router";
import { loginUser } from "../api/auth"; // make sure this exists

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
      await loginUser({ email, password });
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
      if (status === 400 && Array.isArray(data?.error)) {
        data.error.forEach((e) => {
          if (e.path?.[0] === "email") setEmailError(e.message);
          if (e.path?.[0] === "password") setPasswordError(e.message);
        });
        return;
      }

      // AUTH ERROR (401)
      if (status === 401) {
        setServerError(data?.message || "Invalid email or password");
        return;
      }

      // FALLBACK
      setServerError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">Login</h1>

      {rateLimited && (
        <p className="text-red-500">
          Too many attempts. Please wait and try again.
        </p>
      )}

      {serverError && (
        <p className="text-red-500">{serverError}</p>
      )}

      <Input
        label="Email"
        type="email"
        placeholder="Enter email"
        value={email}
        error={emailError}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        value={password}
        error={passwordError}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        text={loading ? "Logging in..." : "Login"}
        onClick={handleLogin}
        disabled={loading}
      />
    </div>
  );
};

export default Login;
