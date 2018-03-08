import React, { Component } from 'react'
import { Tab, Dropdown, Input, Button, Icon, Link } from 'semantic-ui-react'

import NewEvent from '../newevent/newevent.jsx'

import styles from './signin.scss'

import axios from 'axios'

class SignIn extends Component {

    constructor() {
        super();
        this.state = {
            mode: true,
            events: [],
            event_id: '',
            value: '',
            error: '',
            date: new Date(Date.now()).toLocaleDateString("en-US", {year: "numeric", month: "short", day: "numeric"})
        };

        this.handleEventSelect = this.handleEventSelect.bind(this);
        this.changeMode = this.changeMode.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(type) {
        // Validate netid here and set error state if there's problems

        if (type === 'event') {
            axios.put('http://points-api.illinoiswcs.org/api/events/' + this.state.event_id, { event_id: this.state.event_id, netid: this.state.value }).then( (response) => {
                console.log(response)
            });
        } else if (type === 'committee' || type === 'office_hours'){
            const update = {
                netid: this.state.value,
                type: type,
                date: this.state.date
            }

            axios.put('http://points-api.illinoiswcs.org/api/users/' + this.state.value, update).then( (response) => {
                console.log(response);
            })
        }

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
        axios.get('http://points-api.illinoiswcs.org/api/events').then( (response) => {
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

                <Input fluid placeholder='Enter your NetID ...' value={this.state.value} onChange={this.handleChange} />

                <br />
                { this.state.error }
                <Button fluid onClick={() => this.handleSubmit('event')}>Sign-in</Button>

            </Tab.Pane> },
          { menuItem: 'Committee', render: () =>
            <Tab.Pane attached={false}>

                <h4>Date</h4>
                <Input fluid value={this.state.date} onChange={this.handleChange} />
                <br />
                <h4>NetId</h4>
                <Input fluid placeholder='Enter your NetID ...' value={this.state.value} onChange={this.handleChange} />
                <br />
                <Button fluid onClick={() => this.handleSubmit('committee')}>Sign-in</Button>

            </Tab.Pane> },
          { menuItem: 'Office Hour', render: () =>
            <Tab.Pane attached={false}>
                <h4>Date</h4>
                <Input fluid value={this.state.date} onChange={this.handleChange} />
                <br />
                <h4>NetId</h4>
                <Input fluid placeholder='Enter your NetID ...' value={this.state.value} onChange={this.handleChange} />
                <br />
                <Button fluid onClick={() => this.handleSubmit('office_hours')}>Sign-in</Button>
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
