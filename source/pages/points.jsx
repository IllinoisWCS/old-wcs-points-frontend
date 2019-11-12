import React, { Component } from 'react'
import { Form, Input, Button, Segment, Statistic, Card, Grid} from 'semantic-ui-react'

import axios from 'axios'

import styles from '../styles/points.scss'

class Points extends Component {

    constructor() {
        super();
        this.state = {
            value: '',
            events: [],
            totalPoints: '',
            eventPoints: '',
            committeePoints: '',
            ohPoints: '',
            gwcPoints: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
    }

    handleSubmit() {
        axios.get('http://points-api.illinoiswcs.org/api/users/' + this.state.value).then( (response) => {
       
        // axios.get('http://localhost:3000/api/users/' + this.state.value).then( (response) => {
           
            const total_points = response.data.result.points;

            const totalPoints = `You have ${total_points} total points.`
    
            this.setState({
                totalPoints
                
            });
        });
    }

    handleEnter(tgt) {
      if (tgt.charCode === 13) {
        this.handleSubmit();
      }
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    render() {

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
                <h1>Points</h1>
                <Card fluid className="Points">
                  <Card.Content>


                    <br />

                    <Input fluid icon='search' placeholder='Enter your NetID ...' value={this.state.value} onChange={this.handleChange} onKeyPress={this.handleEnter}/>
                    <br />
                    <Button onClick={this.handleSubmit} fluid>Check Points</Button>
                    <br/>
                    <div className = "points-message">
                        <h1>{ this.state.totalPoints }</h1>
                    </div>
                    <div className='points-list'>
                        <h3>{this.state.eventPoints}</h3>
                        <h3>{this.state.committeePoints}</h3>
                        <h3>{this.state.ohPoints}</h3>
                        <h3>{this.state.gwcPoints}</h3>
                    </div>
                    { events }
                  </Card.Content>
                </Card>
            </div>
        )
    }
}

export default Points
