import { useState } from "react";
import {EyeOff} from "lucide-react"
import {Eye} from "lucide-react"

export default function PasswordInput({
  label,
  value,
  onChange,
  error,
  placeholder
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="form-control w-full max-w-xs mb-1">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
        placeholder={placeholder}

         className={`input input-bordered input-primary w-full ${
          error ? "input-error " : ""
        }`}
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm opacity-70"
        >
          {show ?  <EyeOff />: <Eye />}
        </button>
        
      </div>

      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}
