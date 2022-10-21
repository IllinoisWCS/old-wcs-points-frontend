import React, { useEffect, useState } from "react";
import { Segment, Button } from "semantic-ui-react";
import "../styles/events.scss";
import NewEventModal from "../components/newNewEventModal.jsx";
import Notifications, { notify } from "react-notify-toast";
const moment = require("moment");
const utils = require("../utils");
const axios = require("axios");

const Events = () => {
  const [events, setEvents] = useState([]);
  const [modal, setModal] = useState(false);
  const [reloadOnClose, setReloadOnClose] = useState(false);

  useEffect(() => {
    axios
      .get("https://points-api.illinoiswcs.org/api/events")
      .then(function (response) {
        let events = response.data.result;

        if (events) {
          events = events.filter(function (e) {
            return !e.name.toLowerCase().includes("office hour") && !e.private;
          });
          // if (!event.name.toLowerCase().includes('office hours') && !event.name.toLowerCase().includes('girls who code') && !event.name.toLowerCase().includes('committee') ) {
          console.log(events);
          utils.sortEventsByNewest(events);
          setEvents(events);
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  const handleToggleModal = () => {
    setModal(!modal);
    if (reloadOnClose) {
      window.location.reload();
    }
  };

  const handleReloadOnClose = () => {
    setReloadOnClose(!reloadOnClose);
  };

  return (
    <div>
      <Notifications />
      <NewEventModal
        open={modal}
        toggleModal={handleToggleModal}
        reloadOnClose={handleReloadOnClose}
      />
      <Button onClick={handleToggleModal}>Create New Event</Button>
      <Segment.Group>
        {events.map((event) => (
          <Segment key={event._id} padded>
            <div className="flex">
              <div>
                <h3>{event.name}</h3>
                <h5 className="muted">{utils.getEventDate(event)}</h5>
              </div>
              <div></div>
            </div>
          </Segment>
        ))}
      </Segment.Group>
    </div>
  );
};

export default Events;
