import React, { Component } from 'react'
import { Segment, Accordion, Icon, Label, Statistic, Card, Button } from 'semantic-ui-react'
import '../styles/events.scss'
import NewEventModal from '../components/newEventModal.jsx'
import axios from 'axios'
import Notifications, {notify} from 'react-notify-toast';
const moment = require('moment')
const utils = require('../utils')

class Events extends Component {

    constructor() {
        super();
        this.state = {
            events: [],
            modal: false,
            reloadOnClose: false, 
        }
    }

    async componentWillMount() {
        //const response = await axios.get('http://points-api.illinoiswcs.org/api/events');
        const response = await axios.get('http://localhost:3000/api/events');
        let events = response.data.result;
        if (events) {
            utils.sortEventsByNewest(events)
            this.setState({
                events,
            })
        }
    }

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        })
        if (this.state.reloadOnClose) {
            window.location.reload()
        }
    }

    reloadOnClose = () => {
        this.setState({
            reloadOnClose: true,
        })
    }

    render() {
        return (
            <div>
                <Notifications/>
                <NewEventModal 
                    open={this.state.modal} 
                    toggleModal={this.toggleModal} 
                    reloadOnClose={this.reloadOnClose}
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
