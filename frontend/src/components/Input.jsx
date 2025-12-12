import React from "react";

const Input = ({ label, type = "text", value, onChange, placeholder }) => {
  return (
    <div className="form-control w-full max-w-xs mb-1">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input input-bordered input-primary w-full"
      />
    </div>
  );
};

export default Input;
