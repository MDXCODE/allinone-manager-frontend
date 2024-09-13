"use client";

import React, { useState } from "react";
import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useAuth } from "../context/auth-context/authProvider";
import "../css/forms-css/login.css";
import Link from 'next/link';

export default function Home() {
  const { push } = useRouter();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reloadCount = Number(sessionStorage.getItem('reloadCount')) || 0;

  useEffect(() => {
    if(reloadCount < 2) {
      sessionStorage.setItem('reloadCount', String(reloadCount + 1));
      window.location.reload();
    } else {
      sessionStorage.removeItem('reloadCount');
    }
  }, []);

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
          <h1 className="main-login-titles-h1">AllInOne</h1>
          <h5 className="main-login-titles-h5">The Only Productivity Manager You Need</h5>
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

          <div className="sign-up-link">
            <Link href="/signup">
              Don&#39;t have an account? Sign Up
            </Link>
          </div>
          
          <div className="button-container">
            <button type="submit" className="login-button">
              Log In
            </button>
          </div>

        </form>

        <div className="note-of-warning-div">
          <p className="note-of-warning">NOTE: For the best experience, I suggest using on Desktop.</p>
        </div>
        
      </div>
    </main>
  );
}
