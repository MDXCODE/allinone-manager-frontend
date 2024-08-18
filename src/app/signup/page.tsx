"use client";

import React, { useState } from "react";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authProvider';
import Link from 'next/link';
import "../../css/signup.css";

const SignupPage = () => {
  const { push } = useRouter();
  const { signup } = useAuth();
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
    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;

    try {
      await signup(username, email, password);
      push("/signupsuccess");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

    return (
      <main>
      <div className="main-box">
        <div className="main-signup-titles">
          <h1 className="main-signup-titles-h1">Sign Up</h1>
        </div>

        <form onSubmit={handleSubmit} className="main-signup-input">
          <div className="username-signup">
            <input
              type="text"
              id="username"
              name="username"
              required
              className="border rounded border-black"
              placeholder="username"
            />
          </div>

          <div className="email-signup">
            <input
              type="text"
              id="email"
              name="email"
              required
              className="border rounded border-black"
              placeholder="email"
            />
          </div>

          <div className="password-signup">
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

          <div className="login-link">
            <Link href="/">
              Have an account? Log in
            </Link>
          </div>
          
          <div className="button-container">
            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </div>

        </form>
      </div>
    </main>
      );
}

export default SignupPage;