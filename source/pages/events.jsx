import React, { Component } from 'react'
import { Segment, Button } from 'semantic-ui-react'
import '../styles/events.scss'
import NewEventModal from '../components/newEventModal.jsx'
import Notifications, { notify } from 'react-notify-toast';
const moment = require('moment')
const utils = require('../utils')
const axios = require('axios');

class Events extends Component {

    constructor() {
        super();
        this.state = {
            events: [],
            modal: false,
            reloadOnClose: false,
        }
    }

    componentDidMount() {
        var self = this;
        axios.get('http://points-api.illinoiswcs.org/api/events')
        .then(function (response) {
            let events = response.data.result;
        
            if (events) {
                events = events.filter(function(e) { return !e.name.toLowerCase().includes('office hour') })
                // if (!event.name.toLowerCase().includes('office hours') && !event.name.toLowerCase().includes('girls who code') && !event.name.toLowerCase().includes('committee') ) {
                    console.log(events);
                utils.sortEventsByNewest(events)
                self.setState({
                    events,
                })
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        
        // const response = await axios.get('http://localhost:3000/api/events');
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
                <Notifications />
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
                                    <h5 className="muted">{moment(event.date).format('MMM D YYYY')}
                                    </h5>
                                </div>
                                <div>
                          
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
