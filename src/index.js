import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.sass';
import App from './js/App';
import Login from './js/components/login/Login';
import ReactFileUpload from './js/components/ReactFileUpload';
import registerServiceWorker from './js/registerServiceWorker';

const notFound = () => <h1>Not Found</h1>;

const routing = (
  <Router>
      <App/>
    {/*<div>*/}
        {/*<Switch>*/}
            {/*<Route exact path="/" component={App}/>*/}
            {/*<Route path="/upload" component={ReactFileUpload}/>*/}
            {/*<Route component={notFound}/>*/}
        {/*</Switch>*/}
    {/*</div>*/}
  </Router>
);

ReactDOM.render(routing, document.getElementById('root'));
registerServiceWorker();
