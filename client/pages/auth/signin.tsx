import React, { useState } from "react";
import axios from "axios";
import Router from "next/router";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmailChange(e: React.FormEvent<HTMLInputElement>) {
    setEmail(e.currentTarget.value);
  }

  function handlePasswordChange(e: React.FormEvent<HTMLInputElement>) {
    setPassword(e.currentTarget.value);
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/signin",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      Router.push("/");
    } catch (error) {
      console.log(error.response.data);
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleFormSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            onChange={handleEmailChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            onChange={handlePasswordChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
