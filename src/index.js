import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import ApplicationViews from './ApplicationViews'

ReactDOM.render(
  <Router>
    <ApplicationViews />
  </Router>,
  document.getElementById('root')
);
