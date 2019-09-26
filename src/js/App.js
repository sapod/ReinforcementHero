import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import MainPage from './components/main/MainPage';
import Login from './components/login/Login';
import Header from './components/header/Header';
import Signup from './components/signup/Signup';
import Store from "./models/Store";

const notFound = () => <h1>Not Found</h1>;

class App extends Component {
	constructor() {
		super();
        this.store = new Store();
        window.store = this.store;
	}
	render() {
		return (
			<div className="App">
				<Header/>
				<Switch>
					<Route exact path="/" component={() => <MainPage store={ this.store}/>}/>
					<Route path="/login" component={() => <Login store={ this.store}/>}/>
					<Route path="/signup" component={() => <Signup store={ this.store}/>}/>
					<Route component={notFound}/>
				</Switch>
			</div>
		);
	}
}

export default App;
