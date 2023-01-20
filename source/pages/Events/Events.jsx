import React, { useEffect, useState } from 'react';
import { Segment, Button } from 'semantic-ui-react';
import './events.scss';
import Notifications from 'react-notify-toast';
import EventModal from './components/EventModal.jsx';
import axiosInstance from '../../api';
import { getEventDate } from '../../utils';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [modal, setModal] = useState(false);
  const [reloadOnClose, setReloadOnClose] = useState(false);

  useEffect(() => {
    axiosInstance.get('/events').then((res) => {
      setEvents(res.data);
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
      <EventModal
        open={modal}
        toggleModal={handleToggleModal}
        reloadOnClose={handleReloadOnClose}
      />
      <Button onClick={handleToggleModal}>Create New Event</Button>
      <Segment.Group>
        {events.map((event) => (
          <Segment padded>
            <div className="flex">
              <div>
                <h3>{event.name}</h3>
                <h5 className="muted">{getEventDate(event)}</h5>
              </div>
              <div />
            </div>
          </Segment>
        ))}
      </Segment.Group>
    </div>
  );
};

export default Events;
