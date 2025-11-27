import React, { useState } from "react";
import "../css/common.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleReset = (e) => {
    e.preventDefault();
    // placeholder for backend password reset API
  };

  return (
    <div className="ez-login-page">
      <div className="ez-main">
        <div className="ez-card">
          <h2>Forgot Password</h2>
          <form className="ez-form" onSubmit={handleReset}>
            <label className="ez-label">Email</label>
            <input
              className="ez-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="ez-login-btn">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
