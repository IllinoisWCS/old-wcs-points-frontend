const moment = require('moment')

const sortEventsByNewest = events => {
    events.sort(function(event1, event2) {
            const date1 = moment(event1.date)
            const date2 = moment(event2.date)

            if (date1.isBefore(date2)) {
                return 1;
            }
            if (date1.isAfter(date2)) {
                return -1;
            }

            return 0;
    });
}

module.exports = {
    sortEventsByNewest,
}