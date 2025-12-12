import React, { useState } from 'react'
import Input from '../components/Input';
import Button from '../components/Button';
import { useNavigate } from 'react-router';
import { registerUser } from '../api/auth';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate=useNavigate()

  const handleRegister=async()=>{
    setError("")
    try {
        const {data}=await registerUser(email,password)
        console.log("REGISTER SUCCESS:", data);
         navigate("/login");
        
    } catch (error) {
       setError(err.response?.data?.message || "Registration failed");
      
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">Register</h1>
       {error && <p className="text-red-500">{error}</p>}

      <Input
        label="Email"
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button text="Register" onClick={handleRegister} />
    </div>
  );
}

export default Register