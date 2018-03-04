import React, { Component } from 'react'
import { Segment, Accordion, Icon, Label, Statistic, Card } from 'semantic-ui-react'

import styles from './events.scss'

import axios from 'axios'

class Events extends Component {

    constructor() {
        super();
        this.state = {
            events: []
        }
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

        const events = this.state.events.map( (event) => {

            const attendees = event.attendees.map( (attendee) => {
                return(<Label>{attendee}</Label>)
            })

            const panels = [
              {
                title: 'Show Attendees',
                content: {
                  content: (
                      <Segment className="Events__attendees">
                          {attendees}
                      </Segment>
                  )
                }
              },
            ]

            return(
                <Segment className="Events__event" padded>

                    <div className="Events__flex">
                        <div className="Events__flexItem">

                            <h3>{event.name}</h3>

                            <h5 className="muted">{ new Date(event.date).toLocaleDateString("en-US", {year: "numeric", month: "short", day: "numeric"}) }</h5>

                            <Accordion panels={panels} />
                        </div>
                        <div className="Events__flexItem">
                            <Statistic className="Events_statistic" size='tiny'>
                              <Statistic.Value>{event.attendees.length}</Statistic.Value>
                              <Statistic.Label>Attended</Statistic.Label>
                            </Statistic>
                        </div>
                    </div>
                </Segment>
            )
        })

        return(
            <div>
                <h1>Events</h1>

                <Card className="Events" fluid>
                  <Card.Content>

                    { events }
                  </Card.Content>
                </Card>
            </div>
        )
    }
}

export default Events
