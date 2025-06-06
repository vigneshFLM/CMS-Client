// src/components/Auth/AuthLayout.jsx
import React from "react";
import "../../styles/Auth/AuthLayout.css";
import "../../styles/Auth/Login.css";
import "../../styles/Auth/SignUp.css";

const AuthLayout = ({ children, image }) => (
  <div className="auth-page">
    <div className="auth-container">
      <div className="auth-left">
        <h1>
          Welcome To <br />
          Frontlines Edutech
        </h1>
        <img src={image} alt="illustration" />
      </div>
      <div className="auth-right">{children}</div>
    </div>
  </div>
);

export default AuthLayout;
