import React, { Component } from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'

import styles from './home.scss'
import Events from '../events/events.jsx'
import Points from '../points/points.jsx'
import SignIn from '../signin/signin.jsx'
import NewEvent from '../newevent/newevent.jsx'

class Home extends Component {
    render() {
        return(
            <Router>
                <div className="Home">
                    <div className="Home__leftNav">
                        <img src="./assets/logo.png" />
                        <div className="Home__flex">
                            <Link className="Home__flexItem" to="/">Events</Link>
                            <Link className="Home__flexItem" to="/points">Points</Link>
                            <Link className="Home__flexItem" to="/signin">Sign-in</Link>
                        </div>
                    </div>
                    <div className="Home__content">
                        <div>
                            <Route exact path="/" component={Events}/>
                            <Route exact path="/points" component={Points}/>
                            <Route exact path="/signin" component={SignIn}/>
                        </div>
                    </div>
                </div>
            </Router>
        )
    }
}

export default Home
