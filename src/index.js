import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.sass';
import App from './js/App';
import registerServiceWorker from './js/registerServiceWorker';

const routing = (
  <Router>
      <App/>
  </Router>
);

ReactDOM.render(routing, document.getElementById('root'));
registerServiceWorker();
