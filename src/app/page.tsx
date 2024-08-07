// src/app/page.tsx (login/default page)

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authProvider";
import "./css/login.css";

export default function Home() {
  const { push } = useRouter();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = event.currentTarget.username.value;
    const password = event.currentTarget.password.value;

    try {
      await login(username, password);
      push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Incorrect username or password. Please try again.");
    }
  };

  return (
    <main>
      <div className="main-box">
        <div className="main-login-titles">
          <h1 id="main-login-titles-h1">AllInOne</h1>
          <h5 id="main-login-titles-h5">The Only Task Manager You Need</h5>
        </div>

        <form onSubmit={handleSubmit} className="main-login-input">
          <div className="username-login">
            <input
              type="text"
              id="username"
              name="username"
              required
              className="border rounded border-black"
              placeholder="username"
            />
          </div>

          <div className="password-login">
            <input
              type="password"
              id="password"
              name="password"
              required
              className="border rounded border-black"
              placeholder="password"
            />
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <p className="forgot-pass">Forgot Password?</p>
          
          <div className="button-container">
            <button type="submit" className="login-button">
              Log In
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}
