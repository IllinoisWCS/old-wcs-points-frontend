import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "./home.scss";
import Events from "../Events/Events.jsx";
import Points from "../Points/Points.jsx";
import CheckIn from "../CheckIn/CheckIn.jsx";

const Home = () => (
  <Router>
    <div className="home-container">
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
      <div className="content-container">
        <div>
          <Route exact path="/" component={CheckIn} />
          <Route exact path="/points" component={Points} />
          <Route exact path="/events" component={Events} />
        </div>
      </div>
    </div>
  </Router>
);

export default Home;
