import React, { useState, useEffect } from 'react';
import {
  Tab, Modal, Input, Button,
} from 'semantic-ui-react';
import Notifications, { notify } from 'react-notify-toast';

import './checkIn.scss';
import axiosInstance from '../../api';

const CheckIn = () => {
  const [eventKey, setEventKey] = useState('');
  const [eventKeyError, setEventKeyError] = useState(false);

  useEffect(() => {
    // Temporary patch to ensure users are authenticated before checking in
    // TODO: Remove after implementing proper login flow
    axiosInstance.get('/profile');
  }, []);

  const handleSubmit = async () => {
    const isEventKeyError = eventKey === '';
    setEventKeyError(isEventKeyError);
    if (isEventKeyError) {
      return;
    }

    axiosInstance
      .patch('/profile', { eventKey })
      .then((res) => {
        notify.show(res.data.message, 'success');
      })
      .catch((err) => {
        notify.show(err.response.data.message, 'error');
      });
  };

  const handleEnter = (tgt) => {
    if (tgt.charCode === 13) {
      handleSubmit();
    }
  };

  const handleChangeKey = (event) => {
    setEventKey(event.target.value);
  };

  return (
    <div className="check-in">
      <h1>Check-in</h1>
      <br />
      <Notifications />
      <Tab.Pane>
        <h4>Event Key</h4>

        <Input
          fluid
          error={eventKeyError}
          placeholder="Enter the event key..."
          value={eventKey}
          onChange={handleChangeKey}
          onKeyPress={handleEnter}
        />

        <br />

        <Button fluid onClick={() => handleSubmit()}>
          Check-in
        </Button>
      </Tab.Pane>
    </div>
  );
};

export default CheckIn;
