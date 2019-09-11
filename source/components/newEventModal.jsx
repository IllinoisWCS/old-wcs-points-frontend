import React, { Component } from 'react'
import { Input, Button, Modal, Form, Select, Message, Alert } from 'semantic-ui-react'
import axios from 'axios'
import styles from '../styles/newEventModal.scss'

class NewEventModal extends Component {

    constructor() {
        super();
        this.state = {
            // form input
            name: '',
            category: '',
            points: 1,
            date: '',
            startTime: '',
            endTime: '',
            password: '',

            // form validation
            nameErr: false,
            categoryErr: false,
            pointsErr: false,
            dateErr: false,
            startTimeErr: false,
            endTimeErr: false,
            passwordErr: false,

            // form message
            success: false,
            error: false,
            msg: '',        
        }
    }

    handleChange = (event, data) => {
        const fieldErr = `${event.target.id}Err`
        this.setState({
            [event.target.id]: data.value
        })
        if (this.state[fieldErr]) {
            this.setState({
                [fieldErr]: false,
            })
        }
        
    }

    validateFields = (event) => {
        // if user tries to create multiple events w/o closing
        if (this.state.success) {
            this.setState({
                success: false,
            })
        } 
        let valid = true
        for (let field in event) {
            if (!event[field]) {
                const fieldErr = `${field}Err`
                this.setState({
                    [fieldErr]: true,
                })
                valid = false
            }
        }
        return valid
    }

    validateEvent = async () => {
        const event = {
            name: this.state.name,
            category: this.state.category,
            points: this.state.points,
            date: this.state.date,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            password: this.state.password,
        }
        if (this.validateFields(event)) {
            await this.createEvent(event)
        }
    }

    createEvent = async (event) => {

        const res = await axios.post('http://points-api.illinoiswcs.org/api/events', event)
        // const res = await axios.post('http://localhost:3000/api/events', event)
        console.log(res.data);
        if (res.data.code === 200) {
            this.setState({
                success: true,
                error: false,
                msg: `Success! Event key is ${res.data.result}.`,
            })
            this.clearFieldsOnSuccess(event)
            // this.props.reloadOnClose()
            // this.props.toggleModal()    
        } else if (res.data.code === 404) {
            this.setState({
                success: false,
                error: true,
                msg: 'You are not authorized to create events.'
            })
        } 
    }

    // if user tries to create multiple events w/o closing
    clearFieldsOnSuccess = (event) => {
        for (let field in event) {
            if (field === 'points') {
                this.setState({
                    points: 1,
                })
            } else {
                this.setState({
                    [field]: '',
                })
            }
        }
    }

    clearAndToggle = () => {
        if (this.state.nameErr) {
            this.setState({
                nameErr: false
            })
        }
        if (this.state.categoryErr) {
            this.setState({
                categoryErr: false
            })
        }
        if (this.state.pointsErr) {
            this.setState({
                pointsErr: false
            })
        }
        if (this.state.dateErr) {
            this.setState({
                dateErr: false
            })
        }
        if (this.state.startTimeErr) {
            this.setState({
                startTimeErr: false
            })
        }
        if (this.state.endTimeErr) {
            this.setState({
                endTimeErr: false
            })
        }
        if (this.state.passwordErr) {
            this.setState({
                passwordErr: false
            })
        }
        this.props.toggleModal()
    }

    render() {
        const categories = [
            { key: 'c', text: 'Corporate', value: 'corporate' },
            { key: 's', text: 'Social', value: 'social' },
            { key: 'o', text: 'Outreach', value: 'outreach' },
            { key: 'm', text: 'Mentoring', value: 'mentoring' },
            { key: 't', text: 'Tech Team', value: 'techTeam' },
            { key: 'g', text: 'General Meeting', value: 'generalMeeting' },
            { key: 'x', text: 'Other', value: 'other' }
        ]

        return (
            <Modal 
                open={this.props.open} 
                onClose={this.clearAndToggle} 
                closeIcon
            >
                <Modal.Content>
                    <h4 className='modal-heading'>All fields are required.</h4>
                    <Form 
                        onSubmit={this.validateEvent} 
                        success={this.state.success}
                        error={this.state.error}
                    >
                        <Form.Field
                            id='name'
                            control={Input}
                            label='Name'
                            placeholder='i.e. October General Meeting'
                            onChange={this.handleChange}
                            error={this.state.nameErr}
                            value={this.state.name}
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
                            error={this.state.categoryErr}
                            value={this.state.category}
                        />
                        <Form.Field
                            id='points'
                            control={Input}
                            label='Points'
                            value={1}
                            onChange={this.handleChange}
                            error={this.state.pointsErr}
                            value={this.state.points}
                        />
                        <Form.Field
                            id='date'
                            control={Input}
                            label='Date'
                            type='date'
                            onChange={this.handleChange}
                            error={this.state.dateErr}
                            value={this.state.date}
                        />
                        <Form.Field
                            id='startTime'
                            control={Input}
                            label='Start Time'
                            type='time'
                            onChange={this.handleChange}
                            error={this.state.startTimeErr}
                            value={this.state.startTime}
                        />
                        <Form.Field
                            id='endTime'
                            control={Input}
                            label='End Time'
                            type='time'
                            onChange={this.handleChange}
                            error={this.state.endTimeErr}
                            value={this.state.endTime}
                        />
                        <Form.Field
                            id='password'
                            control={Input}
                            label='NetId'
                            placeholder=''
                            onChange={this.handleChange}
                            error={this.state.passwordErr}
                            value={this.state.password}
                        />
                        <Message success content={this.state.msg}/>
                        <Message error content={this.state.msg}/>
                        <Button type='submit'>Submit</Button>
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }

}

export default NewEventModal
