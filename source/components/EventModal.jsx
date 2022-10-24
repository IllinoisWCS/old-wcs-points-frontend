import React, { useState } from "react";
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
import styles from "../styles/eventModal.scss";

const EventModal = ({ open, toggleModal, reloadOnClose }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [points, setPoints] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sameDay, setSameDay] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [password, setPassword] = useState("");
  const [visibility, setVisibility] = useState("public");

  const [pointsErr, setPointsErr] = useState(false);
  const [startDateErr, setStartDateErr] = useState(false);
  const [endDateErr, setEndDateErr] = useState(false);
  const [startTimeErr, setStartTimeErr] = useState(false);
  const [endTimeErr, setEndTimeErr] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");

  const handleNameChange = (_, data) => {
    setName(data.value);
  };

  const handleCategoryChange = (_, data) => {
    setCategory(data.value);
  };

  const handlePointsChange = (_, data) => {
    if (!(data.value > 0 && data.value <= 5)) setPointsErr(true);
    else setPointsErr(false);
    setPoints(data.value);
  };

  const handleStartDateChange = (_, data) => {
    const newStartDate = data.value;
    if (
      new Date(newStartDate).getTime() > new Date(endDate).getTime() ||
      (new Date(newStartDate).getTime() == new Date(endDate).getTime() &&
        startTime &&
        endTime &&
        startTime >= endTime)
    )
      setStartDateErr(true);
    else setStartDateErr(false);
    setStartDate(newStartDate);
  };

  const handleEndDateChange = (_, data) => {
    const newEndDate = data.value;
    if (
      new Date(newEndDate).getTime() < new Date(startDate).getTime() ||
      (new Date(newEndDate).getTime() == new Date(startDate).getTime() &&
        startTime &&
        endTime &&
        startTime >= endTime)
    )
      setEndDateErr(true);
    else setEndDateErr(false);
    setEndDate(newEndDate);
  };

  const handleStartTimeChange = (_, data) => {
    const newStartTime = data.value;
    if (sameDay && endTime && newStartTime >= endTime) setStartTimeErr(true);
    else if (
      new Date(startDate).getTime() == new Date(endDate).getTime() &&
      endTime &&
      newStartTime >= endTime
    )
      setStartTimeErr(true);
    else setStartTimeErr(false);
    setStartTime(newStartTime);
  };

  const handleEndTimeChange = (_, data) => {
    const newEndTime = data.value;
    if (sameDay && newEndTime && startTime >= newEndTime) setEndTimeErr(true);
    else if (
      new Date(startDate).getTime() == new Date(endDate).getTime() &&
      startTime &&
      startTime >= newEndTime
    )
      setEndTimeErr(true);
    else setEndTimeErr(false);
    setEndTime(newEndTime);
  };

  const handlePasswordChange = (_, data) => {
    setPassword(data.value);
  };

  const handleVisibilityChange = (_, data) => {
    setVisibility(data.value);
  };

  const handleSameDayChange = (_, data) => {
    setSameDay(data.checked);
    setEndDateErr(false);
    if (endTime && startTime && startTime >= endTime) setEndTimeErr(true);
  };

  const clearAndToggle = () => {
    if (pointsErr) setPointsErr(false);
    if (startDateErr) setStartDateErr(false);
    if (endDateErr) setEndDateErr(false);
    if (startTimeErr) setStartTimeErr(false);
    if (endTimeErr) setEndTimeErr(false);
    toggleModal();
  };

  const validateFields = () => {
    if (success) setSuccess(false);
    if (pointsErr) return false;
    if (startDateErr) return false;
    if (endDateErr) return false;
    if (startTimeErr) return false;
    if (endTimeErr) return false;
    return true;
  };

  const validateEvent = async () => {
    if (validateFields()) {
      const event = {
        name: name,
        category: category,
        points: points,
        startDate: startDate,
        endDate: sameDay ? startDate : endDate,
        startTime: startTime,
        endTime: endTime,
        password: password,
        private: visibility === "private",
      };
      await createEvent(event);
    }
  };

  const createEvent = async (event) => {
    const res = await axios.post(
      "https://points-api.illinoiswcs.org/api/events",
      event
    );
    if (res.data.code === 200) {
      setSuccess(true);
      setError(false);
      setMsg(`Success! Event key is ${res.data.result}.`), reloadOnClose();
    } else if (res.data.code === 404) {
      setSuccess(false);
      setError(true);
      setMsg("You are not authorized to create events.");
    } else if (res.data.code === 500) {
      setSuccess(false);
      setError(true);
      setMsg(
        "Internal Error: event creation was unsuccessful. Please contact the current WCS infra chair for help."
      );
    }
  };

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
    <Modal open={open} onClose={clearAndToggle} closeIcon>
      <Modal.Content>
        <h4 className="modal-heading">All fields are required.</h4>
        <Form onSubmit={validateEvent} success={success} error={error}>
          <Form.Field
            required
            id="name"
            control={Input}
            label="Name"
            placeholder="i.e. October General Meeting"
            onChange={handleNameChange}
            value={name}
          />
          <Form.Group widths="equal">
            <Form.Field
              required
              id="category"
              control={Select}
              label={{ children: "Category", htmlFor: "category" }}
              placeholder="Category"
              options={categories}
              search
              searchInput={{ id: "category" }}
              onChange={handleCategoryChange}
            />
            <Form.Select
              required
              fluid
              id="visibility"
              label="Visibility"
              options={[
                { key: "public", text: "Public", value: "public" },
                { key: "private", text: "Private", value: "private" },
              ]}
              defaultValue="public"
              onChange={handleVisibilityChange}
            />
          </Form.Group>
          <Form.Field
            required
            id="points"
            control={Input}
            label="Points"
            onChange={handlePointsChange}
            error={pointsErr}
            value={points}
          />

          <Form.Group widths="equal">
            <Form.Field
              required
              id="startDate"
              control={Input}
              label="Start Date"
              type="date"
              onChange={handleStartDateChange}
              error={startDateErr}
              value={startDate}
            />
            <Form.Field
              required
              id="startTime"
              control={Input}
              label="Start Time"
              type="time"
              onChange={handleStartTimeChange}
              error={startTimeErr}
              value={startTime}
            />
          </Form.Group>

          <Form.Group widths="equal">
            <Form.Field
              required={!sameDay}
              id="endDate"
              control={Input}
              label="End Date"
              type="date"
              onChange={handleEndDateChange}
              error={endDateErr}
              value={sameDay ? startDate : endDate}
              disabled={sameDay}
              className={sameDay ? "inactive" : ""}
            />

            <Form.Field
              required
              id="endTime"
              control={Input}
              label="End Time"
              type="time"
              onChange={handleEndTimeChange}
              error={endTimeErr}
              value={endTime}
            />
          </Form.Group>

          <Form.Field>
            <Checkbox
              required
              id="sameDay"
              label="Same day"
              onChange={handleSameDayChange}
              checked={sameDay}
            />
          </Form.Field>

          <Form.Field
            required
            id="password"
            control={Input}
            label="NetId"
            placeholder=""
            onChange={handlePasswordChange}
            value={password}
          />
          <Message success content={msg} />
          <Message error content={msg} />
          <Button type="submit">Submit</Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default EventModal;
