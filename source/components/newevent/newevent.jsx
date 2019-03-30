import React, { Component } from 'react'
import { Input, Card, Button, Dropdown } from 'semantic-ui-react'
import Notifications, {notify} from 'react-notify-toast';

import styles from './newevent.scss'

import axios from 'axios'

class NewEvent extends Component {

    constructor() {
        super();
        this.state = {
            name: '',
            points: 1,
            category: '',
            date: '',
            pw: ''
        }

        this.handleName = this.handleName.bind(this);
        this.handlePoints = this.handlePoints.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.handlePw = this.handlePw.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleCategorySelect = this.handleCategorySelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleName(event) {
        this.setState({name: event.target.value});
    }
    handlePoints(event) {
        this.setState({points: event.target.value});
    }
    handleDate(event) {
        this.setState({date: event.target.value});
    }
    handlePw(event) {
        this.setState({pw: event.target.value});
    }
    handleCategorySelect(e, data) {
      this.setState({
          category: data.value
      })
    }
    handleEnter(tgt) {
      if (tgt.charCode === 13) {
        this.handleSubmit();
      }
    }

    handleSubmit() {
        let newEvent = {
            name: this.state.name,
            points: this.state.points,
            category: this.state.category,
            date: this.state.date,
            pw: this.state.pw
        };

        axios.post('http://localhost:3000/api/events', newEvent).then( (response) => {
            console.log(response);
            this.handleStatus(response);
        }).catch(e => {
            this.handleStatus(e.response);
        });
    }

    handleStatus(response) {
      if (response.status === 201)
        notify.show(`event ${response.data.data.name} was created! the event key is ${response.data.data.key}.`, "success")
      else if (response.status === 500)
        notify.show("please try again", "error");
    }

    componentWillMount() {

    }
    render() {
      let categoryOptions = ['General Meeting', 'Tech Team', 'Mentoring', 'Social', 'Outreach', 'Corporate', 'Other']
      let categorySelectionOptions = []
      categoryOptions.forEach( (option) => {
          let categoryOption = {};
          categoryOption.key = option;
          categoryOption.text = option;
          categoryOption.value = option;
          categorySelectionOptions.push(categoryOption)
      });
        return(
            <Card fluid className="NewEvent">
              <Notifications />
                <Card.Content>
                    <h4>Event Name</h4>
                    <Input fluid placeholder='i.e. Google Tech Talk' value={this.state.name} onChange={this.handleName} onKeyPress={this.handleEnter}/>
                    <br />
                    <h4>Category</h4>
                    <Dropdown
                        button
                        className='icon'
                        floating
                        fluid
                        labeled
                        options={categorySelectionOptions}
                        onChange={this.handleCategorySelect}
                        onKeyPress={this.handleEnter}
                        search
                        value={this.state.category}
                        text={this.state.category}
                        default={'Select a Category'}
                    />
                    <br />
                    <h4>Points</h4>
                    <Input fluid placeholder='i.e. 2' value={this.state.points} onChange={this.handlePoints} onKeyPress={this.handleEnter}/>
                    <br />

                    <h4>Event Date</h4>
                    <Input fluid placeholder='i.e. DD/MM/YY or DD-MM-YY or January 1, 2018' value={this.state.date} onChange={this.handleDate} onKeyPress={this.handleEnter}/>
                    <br />

                    <h4>Password</h4>
                    <Input fluid placeholder=';)' value={this.state.pw} onChange={this.handlePw} onKeyPress={this.handleEnter}/>
                    <br />

                    <Button fluid onClick={this.handleSubmit}>Create Event</Button>
                </Card.Content>
            </Card>
        )
    }
}

export default NewEvent
