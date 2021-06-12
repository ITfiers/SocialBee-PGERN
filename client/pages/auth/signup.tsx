import React, { useState } from "react"
import axios from "axios"
import Router from "next/router"
import { buildClient } from "../../src/api/build-client"

export default function SignUp() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")

    function handleEmailChange(e: React.FormEvent<HTMLInputElement>) {
        setEmail(e.currentTarget.value)
    }

    function handlePasswordChange(e: React.FormEvent<HTMLInputElement>) {
        setPassword(e.currentTarget.value)
    }

    function handleUsernameChange(e: React.FormEvent<HTMLInputElement>) {
        setUsername(e.currentTarget.value)
    }

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            const client = buildClient()
            const { data } = await client.post("/api/auth/signup", {
                email,
                password,
                username,
            })

            Router.push("/")
        } catch (error) {
            console.log(error.response.data)
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
                    <label htmlFor="username" className="form-label">
                        Username
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        onChange={handleUsernameChange}
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
    )
}
