import React, { Component } from "react";
import {
  Tab,
  Dropdown,
  Input,
  Button,
  Message,
  Icon,
  Link,
  Popup,
} from "semantic-ui-react";
import Notifications, { notify } from "react-notify-toast";

//import NewEvent from '../components/newevent.jsx'

import styles from "../styles/signin.scss";

import axios from "axios";

const utils = require("../utils");

class SignIn extends Component {
  constructor() {
    super();

    this.state = {
      mode: true,
      events: [],
      event_name: "",
      event_id: "",
      event_key: "",
      point: 0,
      attendedEvents: [],
      value: "",
      error: "",
      date: new Date(Date.now()).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      errorHeader: "",
      errorContent: "",
      eventError: false,
      eventKeyError: false,
      netIDError: false,
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
    this.handleStatus = this.handleStatus.bind(this);
  }

  handleAlreadySubmitted(key) {
    return this.state.attendedEvents.some((item) => key === item.name);
  }

  async handleSubmit(type) {
    if (type === "event") {
      if (!this.state.value.match("^[A-Za-z0-9]*$")) {
        this.setState({
          errorHeader: "Invalid Net ID",
          errorContent: "Net ID can only contain numbers and letters.",
        });
        return;
      } else {
        this.setState({
          errorHeader: "",
          errorContent: "",
        });
      }

      var netIDError;
      var eventError;
      var eventKeyError;
      if (this.state.value === "") {
        netIDError = true;
      } else {
        netIDError = false;
      }

      if (this.state.event_key === "") {
        eventKeyError = true;
      } else {
        eventKeyError = false;
      }

      if (this.state.event_id === "") {
        eventError = true;
      } else {
        eventError = false;
      }

      this.setState({
        netIDError: netIDError,
        eventKeyError: eventKeyError,
        eventError: eventError,
      });

      if (netIDError || eventKeyError || eventError) {
        return;
      }

      // test local api
      // const res = await axios.put('http://localhost:3000/api/events/' + this.state.event_id,
      //                             {
      //                               event_id: this.state.event_id,
      //                               netid: this.state.value.toLowerCase(),
      //                               event_key: this.state.event_key
      //                             }
      //                            );
      const res = await axios.put(
        "https://points-api.illinoiswcs.org/api/events/" + this.state.event_id,
        {
          event_id: this.state.event_id,
          netid: this.state.value.toLowerCase(),
          event_key: this.state.event_key,
        }
      );

      if (res.data.code == 200) {
        this.registerUser(this.state.value.toLowerCase(), this.state.event_key);
        notify.show("Successfully checked in!", "success");
        this.setState({
          success: true,
          error: false,
          msg: `Success! Updated event with user ${this.state.value}`,
        });
      } else if (res.data.code === 404) {
        notify.show("Check in is unsuccessful", "error");
        this.setState({
          success: false,
          error: true,
          msg: "Failed to update event.",
        });
      }
    } else if (type == "officeHour" || type == "committee" || type == "gwc") {
      await this.registerUser(
        this.state.value.toLowerCase(),
        this.state.event_key
      );

      if (this.state.error == "failed") {
        notify.show("Check in is unsuccessful", "error");
        this.setState({
          success: false,
          error: true,
          msg: "Failed to update event.",
        });
      } else {
        notify.show("Successfully checked in!", "success");
        this.setState({
          success: true,
          error: false,
          msg: `Success! Updated event with user ${this.state.value}`,
        });
      }
    }
  }

  handleStatus(response) {
    if (response.status === 200) {
      notify.show(response.data.message, "success");
    } else if (response.status === 404) {
      notify.show(response.data.message, "error");
    } else if (response.data.message === 500)
      notify.show("Server error!", "error");
  }

  handleEnterEvent(tgt) {
    if (tgt.charCode === 13) {
      this.handleSubmit("event");
    }
  }

  handleEnterCommittee(tgt) {
    if (tgt.charCode === 13) {
      this.handleSubmit("committee");
    }
  }

  handleEnterOH(tgt) {
    if (tgt.charCode === 13) {
      this.handleSubmit("office_hours");
    }
  }

  handleEnterGWC(tgt) {
    if (tgt.charCode === 13) {
      this.handleSubmit("gwc");
    }
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleChangeKey(event) {
    this.setState({ event_key: event.target.value });
  }

  handleEventSelect(e, data) {
    const event_id = data.value;
    this.setState({
      event_id: event_id,
    });

    this.setState({
      event_name: data.text,
    });
  }

  changeMode() {
    this.setState({
      mode: !this.state.mode,
    });
  }

  ignoreInDropDown(name) {
    var ignoreCase = name.toLowerCase();
    if (
      ignoreCase.includes("office hours") ||
      ignoreCase.includes("committee") ||
      ignoreCase.includes("girls who code")
    ) {
      return true;
    }
    return false;
  }

  registerUser = async (netid, eventkey) => {
    // const response = await axios.put("http://localhost:3000/api/users/" + netid, {key:eventkey})
    const response = await axios.put(
      "https://points-api.illinoiswcs.org/api/users/" + netid,
      { key: eventkey }
    );

    if (response.data.code == 200) {
      this.state.attendedEvents = response.data.result;

      this.setState({
        success: true,
        error: false,
        msg: `Success! User: ${netid} information is updated`,
      });
    } else {
      this.setState({
        error: "failed",
        success: false,
      });
    }
  };
  async componentWillMount() {
    const response = await axios.get(
      "https://points-api.illinoiswcs.org/api/events"
    );
    // const response = await axios.get('http://localhost:3000/api/events');

    let events = response.data.result;

    if (events) {
      events = events.filter(function (e) {
        return !e.name.toLowerCase().includes("office hour") && !e.private;
      });
      utils.sortEventsByNewest(events);
      this.setState({
        events: events,
      });
    }
  }

  render() {
    let eventOptions = [];

    this.state.events.forEach((event) => {
      let eventOption = {};
      if (!this.ignoreInDropDown(event.name)) {
        eventOption.key = event._id;
        eventOption.text = event.name;
        eventOption.value = event._id;
        eventOptions.push(eventOption);
      }
    });

    const panes = [
      {
        menuItem: "Event",
        render: () => (
          <Tab.Pane attached={false}>
            <h4>Event</h4>

            <Dropdown
              button
              className="icon"
              floating
              fluid
              labeled
              icon="calendar"
              options={eventOptions}
              onChange={this.handleEventSelect}
              onKeyPress={this.handleEnterEvent}
              search
              value={this.state.event_id}
              text={this.state.event_name}
              default={"Select an Event"}
              error={this.state.eventError}
            />
            <br />
            <h4>NetId</h4>

            <Input
              fluid
              error={this.state.netIDError}
              placeholder="Enter your NetID ..."
              value={this.state.value}
              onChange={this.handleChange}
              onKeyPress={this.handleEnterEvent}
            />

            <br />

            <h4>Event Key</h4>

            <Input
              fluid
              error={this.state.eventKeyError}
              placeholder="Enter the event key..."
              value={this.state.event_key}
              onChange={this.handleChangeKey}
              onKeyPress={this.handleEnterEvent}
            />

            <br />
            {this.state.error}

            <Button fluid onClick={() => this.handleSubmit("event")}>
              Check-in
            </Button>

            {(this.state.errorHeader !== "" ||
              this.state.errorContent !== "") && (
              <Message
                error
                header={this.state.errorHeader}
                content={this.state.errorContent}
              />
            )}
          </Tab.Pane>
        ),
      },

      {
        menuItem: "Committee",
        render: () => (
          <Tab.Pane attached={false}>
            <h4>NetId</h4>
            <Input
              fluid
              placeholder="Enter your NetID ..."
              value={this.state.value}
              onChange={this.handleChange}
              onKeyPress={this.handleEnterCommittee}
            />
            <br />

            <h4>Key</h4>

            <Input
              fluid
              placeholder="Enter the event key..."
              value={this.state.event_key}
              onChange={this.handleChangeKey}
              onKeyPress={this.handleEnterEvent}
            />

            <br />
            <Button fluid onClick={() => this.handleSubmit("committee")}>
              Check-in
            </Button>
          </Tab.Pane>
        ),
      },

      {
        menuItem: "Office Hour",
        render: () => (
          <Tab.Pane attached={false}>
            <h4>NetId</h4>
            <Input
              fluid
              placeholder="Enter your NetID ..."
              value={this.state.value}
              onChange={this.handleChange}
              onKeyPress={this.handleEnterOH}
            />
            <br />
            <h4>Key</h4>

            <Input
              fluid
              placeholder="Enter the event key..."
              value={this.state.event_key}
              onChange={this.handleChangeKey}
              onKeyPress={this.handleEnterEvent}
            />

            <br />
            <Button fluid onClick={() => this.handleSubmit("officeHour")}>
              Check-in
            </Button>
          </Tab.Pane>
        ),
      },

      {
        menuItem: "Girls Who Code",
        render: () => (
          <Tab.Pane attached={false}>
            <h4>NetId</h4>
            <Input
              fluid
              placeholder="Enter your NetID ..."
              value={this.state.value}
              onChange={this.handleChange}
              onKeyPress={this.handleEnterGWC}
            />
            <br />
            <h4>Key</h4>

            <Input
              fluid
              placeholder="Enter the event key..."
              value={this.state.event_key}
              onChange={this.handleChangeKey}
              onKeyPress={this.handleEnterEvent}
            />

            <br />
            <Button fluid onClick={() => this.handleSubmit("gwc")}>
              Check-in
            </Button>
          </Tab.Pane>
        ),
      },
    ];

    return (
      <div className="SignIn">
        {/* <Button className="SignIn__createEvent" onClick={this.changeMode}>
                    <Icon name='signup'/>{ this.state.mode ? "Create Event" : "Sign-in"}

                </Button> */}
        <h1>Check-in</h1>
        <br />
        <Notifications />
        {this.state.mode ? (
          <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
        ) : (
          <NewEvent />
        )}
      </div>
    );
  }
}

export default SignIn;
