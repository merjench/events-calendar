import React, { Component } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";

import "./App.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import axios from "axios";

// console.log("public URL check", process.env.REACT_APP_BASE_URL)

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

let allViews = Object.keys(Views).map((k) => Views[k]);

class App extends Component {
  state = {
    events: [
      // state updated through ComponentDidMount
    ],
  };

  // convert date to display events
  convertDate = (date) => {
    return moment.utc(date).toDate();
  };

  // fetch current/past event API data
  componentDidMount() {
    const authToken = "Bearer ".concat(process.env.REACT_APP_SECRET_KEY);

    axios
      .get("/api/events", {
        headers: {
          Authorization: authToken,
        },
      })
      .then((response) => {
        // console.log("data", response.data);
        let eventList = response.data.content;

        for (let i = 0; i < eventList.length; i++) {
          eventList[i].startDate = this.convertDate(eventList[i].startDate);
          eventList[i].endDate = this.convertDate(eventList[i].endDate);
        }
        this.setState({
          events: eventList,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    const { events } = this.state;
    console.log(this.state.events);

    return (
      <div className="appContainer">
        <div className="App-header">
          <h1 className="h1">👉 CalAgenda 👈</h1>
        </div>

        <div className="App">
          <Calendar
            // selectable
            events={events}
            localizer={localizer}
            defaultDate={new Date()}
            getDrilldownView={(
              targetDate,
              currentViewName,
              configuredViewNames
            ) => {
              if (
                currentViewName === "month" &&
                configuredViewNames.includes("week")
              )
                return "week";

              return null;
            }}
            defaultView="month"
            step={15}
            timeslots={8}
            startAccessor="startDate"
            endAccessor="endDate"
            titleAccessor="name"
            views={allViews}
            style={{ height: "100vh" }}
          />
        </div>
      </div>
    );
  }
}

export default App;
