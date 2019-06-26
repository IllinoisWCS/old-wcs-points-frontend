import React, { Component } from 'react'
import { Segment, Accordion, Icon, Label, Statistic, Card, Button } from 'semantic-ui-react'

import '../styles/events.scss'
import NewEvent from '../components/newevent.jsx'

import axios from 'axios'
const moment = require('moment')

class Events extends Component {

    constructor() {
        super();
        this.state = {
            events: [],
            modal: false,
        }
    }

    async componentWillMount() {
        //const response = await axios.get('http://points-api.illinoiswcs.org/api/events');
        const response = await axios.get('http://localhost:3000/api/events');
        let events = response.data.result;
        if (events) {
            events.sort(function(a, b) {
                var dateA = new Date(a.date).getTime();
                var dateB = new Date(b.date).getTime();
                if (dateA > dateB) {
                    return -1;
                }
                if (dateA < dateB) {
                    return 1;
                }
    
                // names must be equal
                return 0;
            });
    
            this.setState({
                events
            });
        }
    }

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    render() {
        return (
            <div>
                <NewEvent 
                    open={this.state.modal} 
                    toggleModal={this.toggleModal} 
                />
                <Button onClick={this.toggleModal}>Create New Event</Button>
                <Segment.Group>
                    {this.state.events.map(event => (
                        <Segment key={event._id} padded>
                            <div className="flex">
                                <div>
                                    <h3>{event.name}</h3>
                                    <h5 className="muted">{ moment(event.date).format('MMM D YYYY') }
                                    </h5>
                                </div>
                                <div>
                                    <Statistic className="statistic" size='tiny'>
                                    <Statistic.Value>{event.attendees.length}</Statistic.Value>
                                    <Statistic.Label>Attended</Statistic.Label>
                                    </Statistic>
                                </div>
                            </div>
                        </Segment>
                    ))}
                </Segment.Group>
            </div>
        )
    }
}

export default Events
