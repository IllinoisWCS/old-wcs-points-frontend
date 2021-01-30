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

const getEventDate = event => (
    event.date ?
        moment(event.date).format('MMM D YYYY')
        : ( event.startDate === event.endDate ? 
            moment(event.startDate).format('MMM D YYYY') 
            : (
                moment(event.startDate).format('MMM D YYYY') 
                + ' - ' 
                + moment(event.endDate).format('MMM D YYYY')
            )
        )
)

module.exports = {
    sortEventsByNewest,
    getEventDate,
}