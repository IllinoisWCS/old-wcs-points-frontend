const getEventDate = (event) => {
  const start = new Date(event.start).toLocaleDateString('en-US');
  const end = new Date(event.end).toLocaleDateString('en-US');

  if (start === end) {
    return start;
  }
  return `${start} - ${end}`;
};

module.exports = {
  getEventDate,
};
