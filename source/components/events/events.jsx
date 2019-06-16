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

    async componentWillMount() {
        //const response = await axios.get('http://points-api.illinoiswcs.org/api/events');
        const response = await axios.get('http://localhost:3000/api/events');
        let events = response.data.data;
        console.log(response);
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
            events: response.data.data
        });
    }

    sortActiveTechTeam() {
        let dict = {}
        this.state.events.forEach(event => {
            if (event.category === "Tech Team") {
                event.attendees.forEach(attendee => {
                    if (attendee in dict) {
                        dict[attendee] += 1
                    } else {
                        dict[attendee] = 1
                    }
                });
            }
        });
        console.log(dict);
    }

    render() {
        this.sortActiveTechTeam();
        const events = this.state.events.map( (event) => {

            if (event.category === "Corporate") {
              return(
                  <Segment className="Events__corp" padded>

                      <div className="Events__flex">
                          <div className="Events__flexItem">

                              <h3>{event.name}</h3>

                              <h5 className="muted">{ new Date(event.date).toLocaleDateString("en-US", {year: "numeric", month: "short", day: "numeric"}) }</h5>
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
            } else if (event.category === "General Meeting") {
              return(
                  <Segment className="Events__gm" padded>

                      <div className="Events__flex">
                          <div className="Events__flexItem">

                              <h3>{event.name}</h3>

                              <h5 className="muted">{ new Date(event.date).toLocaleDateString("en-US", {year: "numeric", month: "short", day: "numeric"}) }</h5>
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
            } else if (event.category === "Tech Team") {
              return(
                  <Segment className="Events__techTeam" padded>

                      <div className="Events__flex">
                          <div className="Events__flexItem">

                              <h3>{event.name}</h3>

                              <h5 className="muted">{ new Date(event.date).toLocaleDateString("en-US", {year: "numeric", month: "short", day: "numeric"}) }</h5>
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
            } else if (event.category === "Social") {
              return(
                  <Segment className="Events__social" padded>

                      <div className="Events__flex">
                          <div className="Events__flexItem">

                              <h3>{event.name}</h3>

                              <h5 className="muted">{ new Date(event.date).toLocaleDateString("en-US", {year: "numeric", month: "short", day: "numeric"}) }</h5>
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
            } else if (event.category === "Mentoring") {
              return(
                  <Segment className="Events__mentoring" padded>

                      <div className="Events__flex">
                          <div className="Events__flexItem">

                              <h3>{event.name}</h3>

                              <h5 className="muted">{ new Date(event.date).toLocaleDateString("en-US", {year: "numeric", month: "short", day: "numeric"}) }</h5>
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
            } else if (event.category === "Outreach") {
              return(
                  <Segment className="Events__outreach" padded>

                      <div className="Events__flex">
                          <div className="Events__flexItem">

                              <h3>{event.name}</h3>

                              <h5 className="muted">{ new Date(event.date).toLocaleDateString("en-US", {year: "numeric", month: "short", day: "numeric"}) }</h5>
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
            } else {

            return(
                <Segment className="Events__event" padded>

                    <div className="Events__flex">
                        <div className="Events__flexItem">

                            <h3>{event.name}</h3>

                            <h5 className="muted">{ new Date(event.date).toLocaleDateString("en-US", {year: "numeric", month: "short", day: "numeric"}) }</h5>
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
          }
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
