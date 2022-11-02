import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "./home.scss";
import Navbar from "../../global/Navbar.jsx";
import Events from "../Events/Events.jsx";
import Points from "../Points/Points.jsx";
import CheckIn from "../CheckIn/CheckIn.jsx";

const Home = () => (
  <Router>
    <div className="home-container">
      <Navbar />
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
