// src/components/Auth/AuthLayout.jsx
import React from "react";
import "../../styles/Login.css";
import "../../styles/SignUp.css";

const AuthLayout = ({ children, image }) => (
  <div className="login-page">
    <div className="login-container">
      <div className="curve-top-right"></div>
      <div className="login-left">
        <h1>
          Welcome To <br />
          Frontlines Edutech
        </h1>
        <img src={image} alt="illustration" />
      </div>
      <div className="login-right">{children}</div>
    </div>
  </div>
);

export default AuthLayout;
