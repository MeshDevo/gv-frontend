import { NavLink } from "react-router-dom";

// Writing / Translations / Membership links arrive with their pages.
export function Navbar() {
  return (
    <header className="navbar">
      <NavLink to="/" className="navbar-brand">GOLDEN VOICE</NavLink>
      <nav className="navbar-links" aria-label="Main">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/works">Works</NavLink>
      </nav>
    </header>
  );
}
