import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import styles from "../../styles/home.scss";
import Events from "../Events/Events.jsx";
import Points from "../Points/Points.jsx";
import CheckIn from "../CheckIn/CheckIn.jsx";

const Home = () => (
  <Router>
    <div className="Home">
      <div className="Home__leftNav">
        <img src="./assets/logo.png" />
        <div className="Home__flex">
          <Link className="Home__flexItem" to="/">
            Check-in
          </Link>
          <Link className="Home__flexItem" to="/points">
            Points
          </Link>
          <Link className="Home__flexItem" to="/events">
            Events
          </Link>
        </div>
      </div>
      <div className="Home__content">
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
