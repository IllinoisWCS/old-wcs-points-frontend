import React, { Component } from 'react'
import { Tab, Dropdown, Input, Button, Icon, Link } from 'semantic-ui-react'
import Notifications, {notify} from 'react-notify-toast';

import NewEvent from '../newevent/newevent.jsx'

import styles from './signin.scss'

import axios from 'axios'

class SignIn extends Component {

    constructor() {
        super();
        this.state = {
            mode: true,
            events: [],
            event_name: '',
            event_id: '',
            event_key: '',
            value: '',
            error: '',
            date: new Date(Date.now()).toLocaleDateString("en-US", {year: "numeric", month: "short", day: "numeric"})
        };

        this.handleEventSelect = this.handleEventSelect.bind(this);
        this.changeMode = this.changeMode.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleEnterEvent = this.handleEnterEvent.bind(this);
        this.handleEnterCommittee = this.handleEnterCommittee.bind(this);
        this.handleEnterOH = this.handleEnterOH.bind(this);
        this.handlEnterGWC = this.handleEnterGWC.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeKey = this.handleChangeKey.bind(this);
    }

    handleSubmit(type) {
        // production url: 'http://points-api.illinoiswcs.org/api/'
        // Validate netid here and set error state if there's problems
        if (type === 'event') {
          axios.put("http://points-api.illinoiswcs.org/api/events/" + this.state.event_id, { event_id: this.state.event_id, netid: this.state.value, event_key: this.state.event_key }).then( (response) => {
              console.log(response);
              this.handleStatus(response);
          }).catch(e => {
              this.handleStatus(e.response);
          });
        } else if (type === 'committee' || type === 'office_hours' || type === 'gwc'){
            const update = {
                netid: this.state.value,
                type: type,
                date: this.state.date
            }

            axios.put("http://points-api.illinoiswcs.org/api/users/" + this.state.value, update).then( (response) => {
                console.log(response);
                this.handleStatus(response);
            }).catch(e => {
                this.handleStatus(e.response);
            });
        }
    }

    handleStatus(response) {
      console.log(response.data.message)
      if (response.status === 200)
        notify.show(`hello ${response.data.data.netid}!`, "success")
      else if (response.status === 404)
        notify.show(response.data.message, "error")
      else if (response.status === 500)
        notify.show("server error!", "error");
    }

    handleEnterEvent(tgt) {
      if (tgt.charCode === 13) {
        this.handleSubmit('event');
      }
    }

    handleEnterCommittee(tgt) {
      if (tgt.charCode === 13) {
        this.handleSubmit('committee');
      }
    }

    handleEnterOH(tgt) {
      if (tgt.charCode === 13) {
        this.handleSubmit('office_hours');
      }
    }

    handleEnterGWC(tgt) {
      if (tgt.charCode === 13) {
        this.handleSubmit('gwc');
      }
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleChangeKey(event) {
      this.setState({event_key: event.target.value});
    }

    handleEventSelect(e, data) {
        const event_id = data.value;
        this.setState({
            event_id: event_id
        })

        this.setState({
          event_name: data.text
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
                var dateA = a.date; 
                var dateB = b.date;
                if (dateA < dateB) {
                  return 1;
                }
                if (dateA > dateB) {
                  return -1;
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
                    onKeyPress={this.handleEnterEvent}
                    search
                    value={this.state.event_id}
                    text={this.state.event_name}
                    default={'Select an Event'}
                />
                <br />
                <h4>NetId</h4>

                <Input fluid placeholder='Enter your NetID ...' value={this.state.value} onChange={this.handleChange} onKeyPress={this.handleEnterEvent}/>

                <br />

                <h4>Event Key</h4>

                <Input fluid placeholder='Enter the event key...' value={this.state.event_key} onChange={this.handleChangeKey} onKeyPress={this.handleEnterEvent}/>

                <br />
                { this.state.error }
                <Button fluid onClick={() => this.handleSubmit('event')}>Sign-in</Button>

            </Tab.Pane> },
          { menuItem: 'Committee', render: () =>
            <Tab.Pane attached={false}>

                <h4>Date</h4>
                <Input fluid value={this.state.date} onChange={this.handleChange} onKeyPress={this.handleEnterCommittee}/>
                <br />
                <h4>NetId</h4>
                <Input fluid placeholder='Enter your NetID ...' value={this.state.value} onChange={this.handleChange} onKeyPress={this.handleEnterCommittee}/>
                <br />
                <Button fluid onClick={() => this.handleSubmit('committee')}>Sign-in</Button>

            </Tab.Pane> },

          { menuItem: 'Office Hour', render: () =>
            <Tab.Pane attached={false}>
                <h4>Date</h4>
                <Input fluid value={this.state.date} onChange={this.handleChange} onKeyPress={this.handleEnterOH}/>
                <br />
                <h4>NetId</h4>
                <Input fluid placeholder='Enter your NetID ...' value={this.state.value} onChange={this.handleChange} onKeyPress={this.handleEnterOH}/>
                <br />
                <Button fluid onClick={() => this.handleSubmit('office_hours')}>Sign-in</Button>
            </Tab.Pane> },

            { menuItem: 'Girls Who Code', render: () =>
              <Tab.Pane attached={false}>
                  <h4>Date</h4>
                  <Input fluid value={this.state.date} onChange={this.handleChange} onKeyPress={this.handleEnterGWC}/>
                  <br />
                  <h4>NetId</h4>
                  <Input fluid placeholder='Enter your NetID ...' value={this.state.value} onChange={this.handleChange} onKeyPress={this.handleEnterGWC}/>
                  <br />
                  <Button fluid onClick={() => this.handleSubmit('gwc')}>Sign-in</Button>
              </Tab.Pane> },
        ]

        return(
            <div className="SignIn">
                <Button className="SignIn__createEvent" onClick={this.changeMode}>
                    <Icon name='signup'/>{ this.state.mode ? "Create Event" : "Sign-in"}

                </Button>
                <h1>Sign-in</h1>
                <br />
                <Notifications />
                { this.state.mode ? <Tab menu={{ secondary: true, pointing: true }} panes={panes} /> : <NewEvent /> }

            </div>
        )
    }
}

export default SignIn
