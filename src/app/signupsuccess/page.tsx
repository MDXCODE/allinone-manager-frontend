"use client";

import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/auth-context/authProvider";
import Link from "next/link";
import "../../css/forms-css/signup.css";

const SignupSuccess = () => {
const { push } = useRouter();

useEffect(() => {
    const timer = setTimeout(() => {
      push("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, [push]);

  return (
    <main>
      <div className="main-box">
        <div className="success-message">
            <h1>Success!</h1>
            <h5>Redirecting you to login</h5>
        </div>
      </div>
    </main>
  );
};

export default SignupSuccess;
