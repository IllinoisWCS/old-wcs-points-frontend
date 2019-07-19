import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'

// Components
import Home from './components/home.jsx';

require('normalize.css');
require('./styles/main.scss');

render(
    <Home />,
    document.getElementById('app')
);
