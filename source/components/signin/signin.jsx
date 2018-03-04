import React, { Component } from 'react'
import { Tab, Dropdown, Input, Button, Icon, Link } from 'semantic-ui-react'

import NewEvent from '../newevent/newevent.jsx'

import styles from './SignIn.scss'

import axios from 'axios'

class SignIn extends Component {

    constructor() {
        super();
        this.state = {
            mode: true,
            events: [],
            event_id: '',
            value: '',
            error: ''
        };

        this.handleEventSelect = this.handleEventSelect.bind(this);
        this.changeMode = this.changeMode.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {

        // Validate netid here and set error state if there's problems

        axios.put('http://127.0.0.1:3000/api/events/' + this.state.event_id, { event_id: this.state.event_id, netid: this.state.value }).then( (response) => {
            console.log(response)
        });

    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleEventSelect(e, data) {
        const event_id = data.value;
        this.setState({
            event_id: event_id
        })
    }

    changeMode() {
        this.setState({
            mode: !this.state.mode
        })
    }

    componentWillMount() {
        axios.get('http://127.0.0.1:3000/api/events').then( (response) => {
            let events = response.data.data;
            events.sort(function(a, b) {
                var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                var nameB = b.name.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }

                // names must be equal
                return 0;
              });

            this.setState({
                events: response.data.data
            });
        })
    }

    render() {

        let eventOptions = []
        this.state.events.forEach( (event) => {
            let eventOption = {};
            eventOption.key = event._id;
            eventOption.text = event.name;
            eventOption.value = event._id;
            eventOptions.push(eventOption)
        });


        const panes = [
          { menuItem: 'Event', render: () =>
            <Tab.Pane attached={false}>
                <h4>Event</h4>

                <Dropdown
                    button
                    className='icon'
                    floating
                    fluid
                    labeled
                    icon='calendar'
                    options={eventOptions}
                    onChange={this.handleEventSelect}
                    search
                    value={this.state.event_id}
                    text={'Select an Event'}
                />
                <br />
                <h4>NetId</h4>

                <Input fluid icon='search' placeholder='Enter your NetID ...' value={this.state.value} onChange={this.handleChange} />

                <br />
                { this.state.error }
                <Button fluid onClick={this.handleSubmit}>Sign-in</Button>

            </Tab.Pane> },
          { menuItem: 'Committee', render: () =>
            <Tab.Pane attached={false}>

            </Tab.Pane> },
          { menuItem: 'Office Hour', render: () =>
            <Tab.Pane attached={false}>

            </Tab.Pane> },
        ]

        return(
            <div className="SignIn">
                <Button className="SignIn__createEvent" onClick={this.changeMode}>
                    <Icon name='signup'/>{ this.state.mode ? "Create Event" : "Sign-in"}

                </Button>
                <h1>Sign-in</h1>
                <br />

                { this.state.mode ? <Tab menu={{ secondary: true, pointing: true }} panes={panes} /> : <NewEvent /> }

            </div>
        )
    }
}

export default SignIn
