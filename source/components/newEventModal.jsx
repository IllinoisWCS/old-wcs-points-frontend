import React, { Component } from "react";
import {
  Input,
  Button,
  Modal,
  Form,
  Select,
  Message,
  Checkbox,
} from "semantic-ui-react";
import axios from "axios";
import styles from "../styles/newEventModal.scss";

class NewEventModal extends Component {
  constructor() {
    super();
    this.state = {
      // form input
      name: "",
      category: "",
      points: 1,
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      password: "",
      visibility: "public",

      // form validation
      nameErr: false,
      categoryErr: false,
      pointsErr: false,
      startDateErr: false,
      endDateErr: false,
      startTimeErr: false,
      endTimeErr: false,
      passwordErr: false,

      // form message
      success: false,
      error: false,
      msg: "",

      sameDay: false,
    };
  }

  handleChange = (_, data) => {
    const fieldErr = `${data.id}Err`;
    this.setState({
      [data.id]: data.value,
    });
    if (this.state[fieldErr]) {
      this.setState({
        [fieldErr]: false,
      });
    }
    if (
      data.id === "startDate" &&
      this.state.sameDay &&
      this.state.endDateErr
    ) {
      this.setState({
        endDateErr: false,
      });
    }
  };

  handleCheck = (_, data) => {
    this.setState({
      sameDay: data.checked,
      endDateErr: false,
    });
  };

  validateFields = (event) => {
    // if user tries to create multiple events w/o closing
    if (this.state.success) {
      this.setState({
        success: false,
      });
    }
    let valid = true;
    for (let field in event) {
      /*
                Note: the first condition is REQUIRED because field private is a boolean
                and if set to false will prevent event from getting created
            */
      if (field !== "private" && !event[field]) {
        const fieldErr = `${field}Err`;
        this.setState({
          [fieldErr]: true,
        });
        valid = false;
      }
    }
    return valid;
  };

  validateEvent = async () => {
    const event = {
      name: this.state.name,
      category: this.state.category,
      points: this.state.points,
      startDate: this.state.startDate,
      endDate: this.state.sameDay ? this.state.startDate : this.state.endDate,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      password: this.state.password,
      private: this.state.visibility === "private",
    };
    if (this.validateFields(event)) {
      await this.createEvent(event);
    }
  };

  createEvent = async (event) => {
    // const res = await axios.post(
    //   "http://points-api.illinoiswcs.org/api/events",
    //   event
    // );
    const res = await axios.post("http://localhost:3000/api/events", event);
    if (res.data.code === 200) {
      this.setState({
        success: true,
        error: false,
        msg: `Success! Event key is ${res.data.result}.`,
      });
      this.props.reloadOnClose();
    } else if (res.data.code === 404) {
      this.setState({
        success: false,
        error: true,
        msg: "You are not authorized to create events.",
      });
    } else if (res.data.code === 500) {
      this.setState({
        success: false,
        error: true,
        msg: "Internal Error: event creation was unsuccessful. Please contact the current WCS infra chair for help.",
      });
    }
  };

  clearFieldsOnSuccess = (event) => {
    for (let field in event) {
      if (field === "points") {
        this.setState({
          points: 1,
        });
      } else {
        this.setState({
          [field]: "",
        });
      }
    }
  };

  clearAndToggle = () => {
    if (this.state.nameErr) {
      this.setState({
        nameErr: false,
      });
    }
    if (this.state.categoryErr) {
      this.setState({
        categoryErr: false,
      });
    }
    if (this.state.pointsErr) {
      this.setState({
        pointsErr: false,
      });
    }
    if (this.state.startDateErr) {
      this.setState({
        startDateErr: false,
      });
    }
    if (this.state.endDateErr) {
      this.setState({
        endDateErr: false,
      });
    }
    if (this.state.startTimeErr) {
      this.setState({
        startTimeErr: false,
      });
    }
    if (this.state.endTimeErr) {
      this.setState({
        endTimeErr: false,
      });
    }
    if (this.state.passwordErr) {
      this.setState({
        passwordErr: false,
      });
    }
    this.props.toggleModal();
  };

  render() {
    const categories = [
      { key: "c", text: "Corporate", value: "corporate" },
      { key: "s", text: "Social", value: "social" },
      { key: "o", text: "Outreach", value: "outreach" },
      { key: "m", text: "Mentoring", value: "mentoring" },
      { key: "t", text: "Explorations", value: "techTeam" },
      { key: "g", text: "General Meeting", value: "generalMeeting" },
      { key: "r", text: "Growth", value: "growth" },
      { key: "x", text: "Other", value: "other" },
    ];

    return (
      <Modal open={this.props.open} onClose={this.clearAndToggle} closeIcon>
        <Modal.Content>
          <h4 className="modal-heading">All fields are required.</h4>
          <Form
            onSubmit={this.validateEvent}
            success={this.state.success}
            error={this.state.error}
          >
            <Form.Field
              required
              id="name"
              control={Input}
              label="Name"
              placeholder="i.e. October General Meeting"
              onChange={this.handleChange}
              error={this.state.nameErr}
              value={this.state.name}
            />
            <Form.Group widths="equal">
              <Form.Field
                id="category"
                control={Select}
                label={{ children: "Category", htmlFor: "category" }}
                placeholder="Category"
                options={categories}
                search
                searchInput={{ id: "category" }}
                onChange={this.handleChange}
                error={this.state.categoryErr}
                value={this.state.category}
              />
              <Form.Select
                fluid
                id="visibility"
                label="Visibility"
                options={[
                  { key: "public", text: "Public", value: "public" },
                  { key: "private", text: "Private", value: "private" },
                ]}
                defaultValue="public"
                onChange={this.handleChange}
                error={this.state.visibilityErr}
              />
            </Form.Group>
            <Form.Field
              id="points"
              control={Input}
              label="Points"
              onChange={this.handleChange}
              error={this.state.pointsErr}
              value={this.state.points}
            />

            <Form.Group widths="equal">
              <Form.Field
                id="startDate"
                control={Input}
                label="Start Date"
                type="date"
                onChange={this.handleChange}
                error={this.state.startDateErr}
                value={this.state.startDate}
              />
              <Form.Field
                id="startTime"
                control={Input}
                label="Start Time"
                type="time"
                onChange={this.handleChange}
                error={this.state.startTimeErr}
                value={this.state.startTime}
              />
            </Form.Group>

            <Form.Group widths="equal">
              <Form.Field
                id="endDate"
                control={Input}
                label="End Date"
                type="date"
                onChange={this.handleChange}
                error={this.state.endDateErr}
                value={
                  this.state.sameDay ? this.state.startDate : this.state.endDate
                }
                disabled={this.state.sameDay}
                className={this.state.sameDay ? "inactive" : ""}
              />

              <Form.Field
                id="endTime"
                control={Input}
                label="End Time"
                type="time"
                onChange={this.handleChange}
                error={this.state.endTimeErr}
                value={this.state.endTime}
              />
            </Form.Group>

            <Form.Field>
              <Checkbox
                id="sameDay"
                label="Same day"
                onChange={this.handleCheck}
                checked={this.state.sameDay}
              />
            </Form.Field>

            <Form.Field
              required
              id="password"
              control={Input}
              label="NetId"
              placeholder=""
              onChange={this.handleChange}
              error={this.state.passwordErr}
              value={this.state.password}
            />
            <Message success content={this.state.msg} />
            <Message error content={this.state.msg} />
            <Button type="submit">Submit</Button>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}

export default NewEventModal;
