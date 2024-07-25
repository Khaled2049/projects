// app/sign-up/page.js
"use client";
import React from "react";
import { useRef } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import { redirect } from "next/dist/server/api-utils";

const signup = () => {
  const emailRef = useRef();
  const passwordRef = useRef();

  const signup = (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        // ...
        alert(`Successfully signup 
				redirecting to Log in page`);
        window.location.href = "./log-in/";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        alert(errorMessage);
      });
  };
  return (
    <div>
      <center>
        <h1>Sign Up screen</h1>
        <br />
        <br />
        <form onSubmit={signup}>
          <input
            type="email"
            placeholder="Enter your email"
            ref={emailRef}
            style={{ color: "green" }}
          />
          <br />
          <br></br>
          <input
            type="password"
            placeholder="Enter your password"
            ref={passwordRef}
            style={{ color: "green" }}
          />
          <br />
          <br />
          <button
            type="submit"
            className="w-200 p-3 bg-indigo-600 
					rounded text-white hover:bg-indigo-500"
          >
            Sign Up
          </button>
        </form>
      </center>
    </div>
  );
};

export default signup;
