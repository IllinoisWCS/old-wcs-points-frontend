import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './home.scss';
import Navbar from '../../global/Navbar.jsx';
import Events from '../Events/Events.jsx';
import Points from '../Points/Points.jsx';
import CheckIn from '../CheckIn/CheckIn.jsx';

const Home = () => (
  <Router>
    <div className="home-container">
      <Navbar />

      <div className="content-container">
        <Route exact path="/" component={CheckIn} />
        <Route path="/points" component={Points} />
        <Route path="/events" component={Events} />
      </div>
    </div>
  </Router>
);

export default Home;
