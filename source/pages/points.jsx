import React, { Component } from 'react';
import { Input, Button, Segment, Card } from 'semantic-ui-react';
import Notifications, { notify } from 'react-notify-toast';

import axios from 'axios';

import '../styles/points.scss';

class Points extends Component {
    constructor() {
        super();
        this.state = {
            value: '',
            events: [],
            totalPoints: null,
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
    }

    handleSubmit() {
        if (this.state.value !== "") {
            axios.get('http://points-api.illinoiswcs.org/api/users/' + this.state.value).then( (response) => {
            // axios.get('http://localhost:3000/api/users/' + this.state.value).then( (response) => {
                this.setState({
                    totalPoints: response.data.result?.points
                });
    
                if (response.data.result != null) {
                    const eventKeys = response.data.result.attendedEvents;
                    const eventsString = eventKeys?.join(',');
                    axios.get('http://points-api.illinoiswcs.org/api/events', {
                        params: {
                            event_keys: eventsString
                        }
                    }).then(response => {
                        this.setState({
                            events: response.data.result
                        })
                    })
                } else {
                    this.setState({
                        events: [],
                        totalPoints: 0
                    })
                }
            });
        } else {
            notify.show("Please enter a net id", "error");
        }
    }

    handleEnter(tgt) {
      if (tgt.charCode === 13) {
        this.handleSubmit();
      }
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    _renderAttendedEvents(events) {
        return events.map((event, id) => (
            <Segment className="event-detail" padded key={id}>
                <div>
                    <h3>{event.name}</h3>
                    <h5 className="muted">
                        { new Date(event.date).toLocaleDateString("en-US", {
                            year: "numeric", 
                            month: "short", 
                            day: "numeric"
                        }) }
                    </h5>
                </div>
                <div className="event-point">
                    <h3>{event.points}</h3>
                    <h5 className="muted">points</h5>
                </div>
            </Segment>
        ));   
    }

    render() {
        return(
            <div>
                <h1>Points</h1>
                <Card fluid className="Points">
                  <Card.Content>
                    <br />
                    <Input fluid icon='search' placeholder='Enter your NetID ...' value={this.state.value} onChange={this.handleChange} onKeyPress={this.handleEnter}/>
                    <br />
                    <Button onClick={this.handleSubmit} fluid>Check Points</Button>
                    <br/>
                    <div className = "points-message">
                        { this.state.totalPoints != null &&
                            <h1>{ `You have ${this.state.totalPoints} total points.`}</h1>
                        }
                    </div>
                    { this._renderAttendedEvents(this.state.events) }
                  </Card.Content>
                </Card>
                
                <Notifications />
            </div>
        )
    }
}

export default Points
