import React, { Component } from 'react';
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom';

import MainPage from './components/main/MainPage';
import Login from './components/login/Login';
import Header from './components/Header';
import ReactFileUpload from './components/ReactFileUpload';

import TodoList from "./components/login/mobxTryList.js";
import TodoListModel from "./models/TodoListModel";
import TodoModel from "./models/TodoModel";

const notFound = () => <h1>Not Found</h1>;

class App extends Component {
	constructor() {
		super();
        this.store = new TodoListModel();
        window.store = this.store;
	}
	render() {
        this.store.addTodo("Get Coffee");
        this.store.addTodo("Write simpler code");

		return (
			<div className="App">
				<Header/>
				<Switch>
					<Route exact path="/" component={MainPage}/>
					<Route path="/upload" component={ReactFileUpload}/>
					<Route component={notFound}/>
				</Switch>
				{/*<TodoList store={this.store}/>*/}
			</div>
		);
	}
}

export default App;
