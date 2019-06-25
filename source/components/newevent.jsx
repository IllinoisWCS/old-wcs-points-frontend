import React, { Component } from 'react'
import { Input, Button, Modal, Form, Select, Message, Alert } from 'semantic-ui-react'
import Notifications, {notify} from 'react-notify-toast';

// import styles from './newevent.scss'

import axios from 'axios'

class NewEvent extends Component {

    constructor() {
        super();
        this.state = {
            name: '',
            category: '',
            points: 0,
            date: '',
            startTime: '',
            endTime: '',
            password: '',
            showMsg: false,
            message: '',
        }
    }

    handleChange = (event, data) => {
        console.log(`${event.target.id}: ${data.value}`)
        this.setState({
            [event.target.id]: data.value
        })
    }

    // fixes off by one date error
    formatDate = date => {
        const newDate = new Date(date)
        newDate.setDate(newDate.getDate() + 1)
        return newDate
    }

    createEvent = async () => {
        const date = this.formatDate(this.state.date)
        const event = {
            name: this.state.name,
            category: this.state.category,
            points: this.state.points,
            date,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            password: this.state.password,
        }
        const res = await axios.post('http://localhost:3000/api/events', event)
        console.log(res)
        if (res.data.code === 500) {
            this.setState({
                message: 'All fields are required.',
                showMsg: true,
            })
        } else if (res.data.code === 404) {
            this.setState({
                message: 'Invalid password.',
                showMsg: true,
            })
        } else {
            this.props.toggleModal()
            window.location.reload()
        }
    }

    render() {
        const categories = [
            { key: 'c', text: 'Corporate', value: 'corporate' },
            { key: 's', text: 'Social', value: 'social' },
            { key: 'o', text: 'Outreach', value: 'outreach' },
            { key: 'm', text: 'Mentoring', value: 'mentoring' },
            { key: 't', text: 'Tech Team', value: 'techTeam' },
            { key: 'g', text: 'General Meeting', value: 'generalMeeting' },
            { key: 'ot', text: 'Other', value: 'other' }
        ]
        return (
            <Modal open={this.props.open} onClose={this.props.toggleModal} closeIcon>
                <Modal.Content>
                    <Form onSubmit={this.createEvent} error={this.state.showMsg}>
                        <Form.Field
                            id='name'
                            control={Input}
                            label='Name'
                            placeholder='i.e. October General Meeting'
                            onChange={this.handleChange}
                        />
                        <Form.Field
                            id='category'
                            control={Select}
                            label={{ children: 'Category', htmlFor: 'category' }}
                            placeholder='Category'
                            options={categories}
                            search
                            searchInput={{id: 'category'}}
                            onChange={this.handleChange}

                        />
                        <Form.Field
                            id='points'
                            control={Input}
                            label='Points'
                            placeholder='i.e. 1'
                            onChange={this.handleChange}

                        />
                        <Form.Field
                            id='date'
                            control={Input}
                            label='Date'
                            type='date'
                            onChange={this.handleChange}

                        />
                        <Form.Field
                            id='startTime'
                            control={Input}
                            label='Start Time'
                            type='time'
                            onChange={this.handleChange}

                        />
                        <Form.Field
                            id='endTime'
                            control={Input}
                            label='End Time'
                            type='time'
                            onChange={this.handleChange}

                        />
                        <Form.Field
                            id='password'
                            control={Input}
                            label='Password'
                            placeholder=':)'
                            onChange={this.handleChange}

                        />
                        <Message error content={this.state.message}/>
                        <Button type='submit'>Submit</Button>
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }

}

export default NewEvent
