import React from "react";

const Button = ({ text, onClick }) => {
  return (
    <button 
      onClick={onClick} 
      className="btn btn-primary w-full max-w-xs mt-2"
    >
      {text}
    </button>
  );
};

export default Button;
