import React, { useState, useEffect } from "react";
import { Tab, Dropdown, Input, Button, Message } from "semantic-ui-react";
import Notifications, { notify } from "react-notify-toast";

import styles from "./checkIn.scss";
import axios from "axios";

const utils = require("../../utils");

const CheckIn = () => {
  const [events, setEvents] = useState([]);
  const [eventOptions, setEventOptions] = useState([]);
  const [eventName, setEventName] = useState("");
  const [eventId, setEventId] = useState("");
  const [eventKey, setEventKey] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const [errorHeader, setErrorHeader] = useState("");
  const [errorContent, setErrorContent] = useState("");
  const [eventError, setEventError] = useState(false);
  const [eventKeyError, setEventKeyError] = useState(false);
  const [netIdError, setNetIdError] = useState(false);

  const handleSubmit = async (type) => {
    if (type === "event") {
      if (!value.match("^[A-Za-z0-9]*$")) {
        setErrorHeader("Invalid Net ID");
        setErrorContent("Net ID can only contain numbers and letters.");
        return;
      }
      setErrorHeader("");
      setErrorContent("");

      const netIdError = value === "";
      const eventKeyError = eventKey === "";
      const eventError = eventId === "";

      setNetIdError(netIdError);
      setEventKeyError(eventKeyError);
      setEventError(eventError);

      if (netIdError || eventKeyError || eventError) {
        return;
      }

      const res = await axios.put(
        "https://points-api.illinoiswcs.org/api/events/" + eventId,
        {
          event_id: eventId,
          netid: value.toLowerCase(),
          event_key: eventKey,
        }
      );

      if (res.data.code == 200) {
        registerUser(value.toLowerCase(), eventKey);
        notify.show("Successfully checked in!", "success");
        setError(false);
      } else if (res.data.code === 404) {
        notify.show("Check in is unsuccessful", "error");
        setError(true);
      }
    } else if (type == "officeHour" || type == "committee" || type == "gwc") {
      await registerUser(value.toLowerCase(), eventKey);

      if (error == "failed") {
        notify.show("Check in is unsuccessful", "error");
        setError(true);
      } else {
        notify.show("Successfully checked in!", "success");
        setError(false);
      }
    }
  };

  const handleEnterEvent = (tgt) => {
    if (tgt.charCode === 13) {
      handleSubmit("event");
    }
  };

  const handleEnterCommittee = (tgt) => {
    if (tgt.charCode === 13) {
      handleSubmit("committee");
    }
  };

  const handleEnterOH = (tgt) => {
    if (tgt.charCode === 13) {
      handleSubmit("office_hours");
    }
  };

  const handleEnterGWC = (tgt) => {
    if (tgt.charCode === 13) {
      handleSubmit("gwc");
    }
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleChangeKey = (event) => {
    setEventKey(event.target.value);
  };

  const handleEventSelect = (e, data) => {
    const eventId = data.value;
    setEventId(eventId);
    setEventName(data.text);
  };

  const ignoreInDropdown = (name) => {
    var ignoreCase = name.toLowerCase();
    return (
      ignoreCase.includes("office hours") ||
      ignoreCase.includes("committee") ||
      ignoreCase.includes("girls who code")
    );
  };

  const registerUser = async (netId, eventKey) => {
    const response = await axios.put(
      "https://points-api.illinoiswcs.org/api/users/" + netId,
      { key: eventKey }
    );

    if (response.data.code == 200) {
      setError(false);
    } else {
      setError("failed");
    }
  };

  useEffect(() => {
    axios
      .get("https://points-api.illinoiswcs.org/api/events")
      .then((response) => {
        let events = response.data.result;

        if (events) {
          events = events.filter(function (e) {
            return !e.name.toLowerCase().includes("office hour") && !e.private;
          });
          utils.sortEventsByNewest(events);
          setEvents(events);
        }
      });
  }, []);

  useEffect(() => {
    let newEventOptions = [];
    events.forEach((event) => {
      let eventOption = {};
      if (!ignoreInDropdown(event.name)) {
        eventOption.key = event._id;
        eventOption.text = event.name;
        eventOption.value = event._id;
        newEventOptions.push(eventOption);
      }
    });
    setEventOptions(newEventOptions);
  }, [events]);

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
            onChange={handleEventSelect}
            onKeyPress={handleEnterEvent}
            search
            value={eventId}
            text={eventName}
            default={"Select an Event"}
            error={eventError}
          />
          <br />
          <h4>NetId</h4>

          <Input
            fluid
            error={netIdError}
            placeholder="Enter your NetID ..."
            value={value}
            onChange={handleChange}
            onKeyPress={handleEnterEvent}
          />

          <br />

          <h4>Event Key</h4>

          <Input
            fluid
            error={eventKeyError}
            placeholder="Enter the event key..."
            value={eventKey}
            onChange={handleChangeKey}
            onKeyPress={handleEnterEvent}
          />

          <br />
          {error}

          <Button fluid onClick={() => handleSubmit("event")}>
            Check-in
          </Button>

          {(errorHeader !== "" || errorContent !== "") && (
            <Message error header={errorHeader} content={errorContent} />
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
            value={value}
            onChange={handleChange}
            onKeyPress={handleEnterCommittee}
          />
          <br />

          <h4>Key</h4>

          <Input
            fluid
            placeholder="Enter the event key..."
            value={eventKey}
            onChange={handleChangeKey}
            onKeyPress={handleEnterEvent}
          />

          <br />
          <Button fluid onClick={() => handleSubmit("committee")}>
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
            value={value}
            onChange={handleChange}
            onKeyPress={handleEnterOH}
          />
          <br />
          <h4>Key</h4>

          <Input
            fluid
            placeholder="Enter the event key..."
            value={eventKey}
            onChange={handleChangeKey}
            onKeyPress={handleEnterEvent}
          />

          <br />
          <Button fluid onClick={() => handleSubmit("officeHour")}>
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
            value={value}
            onChange={handleChange}
            onKeyPress={handleEnterGWC}
          />
          <br />
          <h4>Key</h4>

          <Input
            fluid
            placeholder="Enter the event key..."
            value={eventKey}
            onChange={handleChangeKey}
            onKeyPress={handleEnterEvent}
          />

          <br />
          <Button fluid onClick={() => handleSubmit("gwc")}>
            Check-in
          </Button>
        </Tab.Pane>
      ),
    },
  ];

  return (
    <div className="check-in">
      <h1>Check-in</h1>
      <br />
      <Notifications />
      <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
    </div>
  );
};

export default CheckIn;
