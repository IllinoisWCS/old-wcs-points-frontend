# WCS Points Frontend

The WCS Points Frontend is the UI that supports the [WCS Points API](https://github.com/IllinoisWCS/wcs_points_api). It mostly uses API calls written there to facilitate signing into WCS events and office hours.

## Installation

Clone or download this repository, then run:

```
npm install
npm run dev
```

It will start up on [localhost:8080](localhost:8080).

## Pages

There are several pages: `events`, `points`, `signin`, `banquet`, and `feedback`.

### Events

Lists all WCS events in chronological order. Color coded by event type (`corporate`, `general meeting`, `tech team`, etc).

### Points

Allows members to check their points.

### Sign-in

Manages signing in for events, office hours, and committee meetings. Officers also create events through a button on the top right (password protected).

### Banquet

Used to get top members and quickly view all members' points.

### Feedback

A brief feedback form for the point checker. It will ping us on Slack!

## Contact

Feel free to reach out to [contact@illinoiswcs.org](mailto:contact@illinoiswcs.org) with any questions or feedback!
