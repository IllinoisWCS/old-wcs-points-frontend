import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";

require("normalize.css");
require("./styles/main.scss");

render(<Home />, document.getElementById("app"));
