import { Link } from "@remix-run/react";

export const Menu = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                    <Link className="nav-link" to="./">
                        Home
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="./about">
                        About
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="./contact">
                        Contact
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="./contactError">
                        ContactError
                    </Link>
                </li>
            </ul>
        </nav>
    )
}