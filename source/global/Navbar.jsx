import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./navbar.scss";

const Navbar = () => (
  <div className="navbar-container">
    <a href="http://wcs.illinois.edu">
      <img src="./assets/logo.png" />
    </a>
    <div className="navbar">
      <Link className="navbar-element" to="/">
        Check-in
      </Link>
      <Link className="navbar-element" to="/points">
        Points
      </Link>
      <Link className="navbar-element" to="/events">
        Events
      </Link>
    </div>
  </div>
);

export default Navbar;
