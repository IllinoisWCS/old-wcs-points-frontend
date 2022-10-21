import React, { useState, useEffect } from "react";
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

const NewEventModal = ({ open, toggleModal, reloadOnClose }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [points, setPoints] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [password, setPassword] = useState("");
  const [visibility, setVisibility] = useState("public");

  const [nameErr, setNameErr] = useState(false);
  const [categoryErr, setCategoryErr] = useState(false);
  const [pointsErr, setPointsErr] = useState(false);
  const [startDateErr, setStartDateErr] = useState(false);
  const [endDateErr, setEndDateErr] = useState(false);
  const [startTimeErr, setStartTimeErr] = useState(false);
  const [endTimeErr, setEndTimeErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [visibilityErr, setVisibilityErr] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");
  const [sameDay, setSameDay] = useState(false);

  const handleCheck = (_, data) => {
    setSameDay(data.checked);
    setEndDateErr(false);
  };

  const validateFields = (event) => {
    if (success) {
      setSuccess(false);
    }
    let valid = true;
    for (let field in event) {
      if (field !== "private" && !event[field]) {
        if (field === "name") setNameErr(true);
        else if (field == "category") setCategoryErr(true);
        else if (field === "points") setPointsErr(true);
        else if (field === "startDate") setStartDateErr(true);
        else if (field === "endDate") setEndDateErr(true);
        else if (field === "startTime") setStartTimeErr(true);
        else if (field === "endTime") setEndTimeErr(true);
        else if (field === "password") setPasswordErr(true);
        valid = false;
      }
    }
    return valid;
  };

  const validateEvent = async () => {
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
    if (validateFields(event)) {
      await createEvent(event);
    }
  };

  const createEvent = async (event) => {
    const res = await axios.post(
      "https://points-api.illinoiswcs.org/api/events",
      event
    );
    // const res = await axios.post("http://localhost:3000/api/events", event);
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

  const clearFieldsOnSuccess = (event) => {
    for (let field in event) {
      if (field === "points") {
        setPoints(1);
      } else {
        // this.setState({ // TODO
        //   [field]: "",
        // });
      }
    }
  };

  const handleNameChange = (_, data) => {
    setName(data.value);
  };

  const handleCategoryChange = (_, data) => {
    setCategory(data.value);
  };

  const handlePointsChange = (_, data) => {
    setPoints(data.value);
  };

  const handleStartDateChange = (_, data) => {
    setStartDate(data.value);
  };

  const handleEndDateChange = (_, data) => {
    setEndDate(data.value);
  };

  const handleStartTimeChange = (_, data) => {
    setStartTime(data.value);
  };

  const handleEndTimeChange = (_, data) => {
    setEndTime(data.value);
  };

  const handlePasswordChange = (_, data) => {
    setPassword(data.value);
  };

  const handleVisibilityChange = (_, data) => {
    setVisibility(data.value);
  };

  const clearAndToggle = () => {
    if (nameErr) setNameErr(false);
    if (categoryErr) setCategoryErr(false);
    if (pointsErr) setPointsErr(false);
    if (startDateErr) setStartDateErr(false);
    if (endDateErr) setEndDateErr(false);
    if (startTimeErr) setStartTimeErr(false);
    if (endTimeErr) setEndTimeErr(false);
    if (passwordErr) setPasswordErr(false);
    if (visibilityErr) setVisibilityErr(false);
    toggleModal();
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
            error={nameErr}
            value={name}
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
              onChange={handleCategoryChange}
              error={categoryErr}
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
              onChange={handleVisibilityChange}
              error={visibilityErr}
            />
          </Form.Group>
          <Form.Field
            id="points"
            control={Input}
            label="Points"
            onChange={handlePointsChange}
            error={pointsErr}
            value={points}
          />

          <Form.Group widths="equal">
            <Form.Field
              id="startDate"
              control={Input}
              label="Start Date"
              type="date"
              onChange={handleStartDateChange}
              error={startDateErr}
              value={startDate}
            />
            <Form.Field
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
              id="sameDay"
              label="Same day"
              onChange={handleCheck}
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
            error={passwordErr}
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

export default NewEventModal;
