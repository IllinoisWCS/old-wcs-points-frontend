import React, { useState } from "react";
import { Input, Button, Segment, Card, Message } from "semantic-ui-react";
import Notifications, { notify } from "react-notify-toast";

import axios from "axios";

const utils = require("../utils");

import "../styles/points.scss";

const Points = () => {
  const [value, setValue] = useState("");
  const [events, setEvents] = useState([]);
  const [totalPoints, setTotalPoints] = useState(null);
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (value !== "") {
      if (!value.match("^[A-Za-z0-9]*$")) {
        setError(true);
        setTotalPoints(null);
        setEvents([]);
        return;
      } else {
        setError(false);
      }
      axios
        .get(
          "http://points-api.illinoiswcs.org/api/users/" + value.toLowerCase()
        )
        .then((response) => {
          // axios.get('http://localhost:3000/api/users/' + this.state.value).then( (response) => {
          setTotalPoints(response.data.result?.points);

          if (response.data.result != null) {
            const eventKeys = response.data.result.attendedEvents;
            const eventsString = eventKeys?.join(",");
            axios
              .get("http://points-api.illinoiswcs.org/api/events", {
                params: {
                  event_keys: eventsString,
                },
              })
              .then((response) => {
                setEvents(response.data.result);
              });
          } else {
            setEvents([]);
            setTotalPoints(0);
          }
        });
    } else {
      notify.show("Please enter a net id", "error");
    }
  };

  const handleEnter = (tgt) => {
    if (tgt.charCode === 13) {
      handleSubmit();
    }
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const _renderAttendedEvents = (events) => {
    return events.map((event, id) => (
      <Segment className="event-detail" padded key={id}>
        <div>
          <h3>{event.name}</h3>
          <h5 className="muted">{utils.getEventDate(event)}</h5>
        </div>
        <div className="event-point">
          <h3>{event.points}</h3>
          <h5 className="muted">points</h5>
        </div>
      </Segment>
    ));
  };

  return (
    <div>
      <h1>Points</h1>
      <Card fluid className="Points">
        <Card.Content>
          <br />
          <Input
            fluid
            icon="search"
            placeholder="Enter your NetID ..."
            value={value}
            onChange={handleChange}
            onKeyPress={handleEnter}
          />
          <br />
          <Button onClick={handleSubmit} fluid>
            Check Points
          </Button>
          {error && (
            <Message
              error
              header="Invalid Net ID"
              content="Net ID can only contain numbers and letters."
            />
          )}
          <br />
          <div className="points-message">
            {totalPoints != null && (
              <h1>{`You have ${totalPoints} total points.`}</h1>
            )}
          </div>
          {_renderAttendedEvents(events)}
        </Card.Content>
      </Card>

      <Notifications />
    </div>
  );
};

export default Points;
