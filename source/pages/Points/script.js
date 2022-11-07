import axios from "axios";

export const cleanEverything = async () => {
  const allMembers = await getAllMembers();
  const eventPoints = await getEventPoints();

  for (const member in allMembers) {
    const attendedEvents = member.attendedEvents;
    let totalPoints = 0;

    for (const event in attendedEvents) {
      if (eventPoints.has(event)) {
        totalPoints += eventPoints.get(event);
      } else {
        console.log(event); // event should be removed from db
      }
    }
    if (totalPoints != member.points) {
      const res = await axios.put(
        "https://points-api.illinoiswcs.org/api/users/",
        {
          net_id: member,
          points: totalPoints,
        }
      );
    }
  };
};

const getEventPoints = async () => {
  const allEvents = await getAllEvents();
  const eventPoints = new Map();

  for (const event in allEvents) {
    eventPoints.set(event.key, event.points);
  }
  return eventPoints;
};

const getAllEvents = async () => {
  axios.get("https://points-api.illinoiswcs.org/api/events/").then((response) => {
    const allEvents = response.data.result;
    return allEvents;
  });
};

const getAllMembers = async () => {
  axios.get("https://points-api.illinoiswcs.org/api/users/").then((response) => {
    const allMembers = response.data.result;
    return allMembers;
  });
};

