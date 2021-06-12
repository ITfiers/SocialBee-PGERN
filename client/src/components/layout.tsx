import Link from "next/link"
import { buildClient } from "../api/build-client"
import Router from "next/router"

interface LayoutProps {
    user: { id: string; username: string }
    children: React.ReactChild
}

export function Layout({ children, user }: LayoutProps) {
    async function signOutUser() {
        const client = buildClient()
        await client.post("api/auth/signout")
        Router.push("/auth/signin")
    }
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand">Navbar</a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link href="/">
                                <a className="nav-link">Home</a>
                            </Link>
                        </li>

                        {user ? (
                            <li className="nav-item" onClick={signOutUser}>
                                <a className="nav-link btn">SignOut</a>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link href="/auth/signin">
                                        <a className="nav-link">Sign In</a>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link href="/auth/signup">
                                        <a className="nav-link">Sign Up</a>
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </nav>
            <main>{children}</main>
        </>
    )
}
