import React, { Component } from 'react'
import { Form, Input, Button, Segment, Statistic, Card } from 'semantic-ui-react'

import axios from 'axios'

import styles from './points.scss'

class Points extends Component {

    constructor() {
        super();
        this.state = {
            value: '',
            events: [],
            message: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit() {
        axios.get('http://127.0.0.1:3000/api/users/' + this.state.value).then( (response) => {
            const events = response.data.data.attended_events;
            const committees = response.data.data.committees;
            const office_hours = response.data.data.office_hours;

            let event_points = 0;
            let committee_points = committees.length * 0.5;
            let office_hour_points = office_hours.length * 0.5;

            events.forEach( (event) => {
                event_points += event.points
            });

            const total_points = event_points + committee_points + office_hour_points;
            const message = `${this.state.value} has ${total_points} total points. (${event_points} event points, ${committee_points} committee points, and ${office_hour_points} office hour points)`

            this.setState({
                message: message,
                events: events
            });
        });
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    render() {

        const events = this.state.events.map( (event) => {

            return(
                <Segment className="Events__event" padded>

                    <div className="Events__flex">
                        <div className="Events__flexItem">

                            <h3>{event.name}</h3>

                            <h5 className="muted">{ new Date(event.date).toLocaleDateString("en-US", {year: "numeric", month: "short", day: "numeric"}) }</h5>

                        </div>
                        <div className="Events__flexItem">
                            <Statistic className="Events_statistic" size='tiny'>
                              <Statistic.Value>{event.points}</Statistic.Value>
                              <Statistic.Label>Points Earned</Statistic.Label>
                            </Statistic>
                        </div>
                    </div>
                </Segment>
            )
        })

        return(
            <div>
                <h1>Points</h1>
                <Card fluid className="Points">
                  <Card.Content>


                    <br />

                    <Input fluid icon='search' placeholder='Enter your NetID ...' value={this.state.value} onChange={this.handleChange} />
                    <br />
                    <Button onClick={this.handleSubmit} fluid>Check Points</Button>

                    <p>{ this.state.message }</p>

                    { events }
                  </Card.Content>
                </Card>
            </div>
        )
    }
}

export default Points
