import React, { useState, useEffect } from "react";
import { Tab, Dropdown, Input, Button, Message } from "semantic-ui-react";
import Notifications, { notify } from "react-notify-toast";

import styles from "../styles/signin.scss";

import axios from "axios";

const utils = require("../utils");

const SignIn = () => {
  const [mode, setMode] = useState(true);
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState("");
  const [eventId, setEventId] = useState("");
  const [eventKey, setEventKey] = useState("");
  const [point, setPoint] = useState(0);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [date, setDate] = useState(
    new Date(Date.now()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  );

  const [errorHeader, setErrorHeader] = useState("");
  const [errorContent, setErrorContent] = useState("");
  const [eventError, setEventError] = useState(false);
  const [eventKeyError, setEventKeyError] = useState(false);
  const [netIdError, setNetIdError] = useState(false);

  const handleAlreadySubmitted = (key) => {
    return attendedEvents.some((item) => key === item.name);
  };

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
        setSuccess(true);
        setError(false);
        setMsg(`Success! Updated event with user ${value}`);
      } else if (res.data.code === 404) {
        notify.show("Check in is unsuccessful", "error");
        setSuccess(false);
        setError(true);
        setMsg("Failed to update event.");
      }
    } else if (type == "officeHour" || type == "committee" || type == "gwc") {
      await registerUser(value.toLowerCase(), eventKey);

      if (error == "failed") {
        notify.show("Check in is unsuccessful", "error");
        setSuccess(false);
        setError(true);
        setMsg("Failed to update event.");
      } else {
        notify.show("Successfully checked in!", "success");
        setSuccess(true);
        setError(false);
        setMsg(`Success! Updated event with user ${this.state.value}`);
      }
    }
  };

  const handleStatus = (response) => {
    if (response.status === 200) {
      notify.show(response.data.message, "success");
    } else if (response.status === 404) {
      notify.show(response.data.message, "error");
    } else if (response.data.message === 500)
      notify.show("Server error!", "error");
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

  const changeMode = () => {
    setMode(!mode);
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
      setAttendedEvents(response.data.result);
      setSuccess(true);
      setError(false);
      setMsg(`Success! User: ${netId} information is updated`);
    } else {
      setError("failed");
      setSuccess(false);
    }
  };

  useEffect(() => {
    axios.get("https://points-api.illinoiswcs.org/api/events").then(() => {
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
};

export default SignIn;
