import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import './main.sass';
import SubmitForm from '../simple_user/submitForm/SubmitForm';
import { Table, Dropdown, DropdownButton, Spinner, Toast } from 'react-bootstrap';
import AssociatesPopup from "../simple_user/associates/AssociatesPopup";
import LeaderBoard, { createAdminTable } from "../LeaderBoard";
import {observer} from 'mobx-react';
import Cookies from 'universal-cookie';
import NewGameForm from "../admin/newGameForm/NewGameForm";

@observer
class MainPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            game: 'Choose game'
        };

        this.cookies = new Cookies();
        if(this.props.store.serverHandler.games.length === 0)
            this.props.store.serverHandler.getGames();
    }

    gameChanged(g) {
        this.setState({game: g.name});
        this.props.store.serverHandler.getAdminAllAssignments(g._id);
    }

    createUserTable() {
        return (
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Game</th>
                    <th>User Names</th>
                    <th>Submission Date</th>
                    <th>Score</th>
                </tr>
                </thead>
                <tbody>
                {this.props.store.serverHandler.assignment_submissions &&
                this.props.store.serverHandler.assignment_submissions.map(s => (
                    <tr>
                        <td>{s.game_name}</td>
                        <td>{s.group_ids.join(',')}</td>
                        <td>{s.submission_date}</td>
                        <td>{s.scores.simpleAvg}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        );
    }

    render() {
        if(this.props.store.serverHandler.user === null) {
            if(this.cookies.get('user'))
                this.props.store.serverHandler.setUserFromCookie();
            else
                return <Redirect to='/login' push={true}/>;
        }

        if(this.props.store.serverHandler.user.email !== 'admin' &&
            this.props.store.serverHandler.assignment_submissions === null) {
                    this.props.store.serverHandler.getUserAssignments();
        }

        return (
            <div>
                <div className={this.props.store.siteData.isLoading ? "overlay" : "hidden"}>
                    <Spinner className="loading_icon" animation="grow" />
                </div>
                <div className="toast_div">
                    <div className="toast_body">
                        <Toast onClose={() => this.props.store.siteData.resetToast()}
                               show={this.props.store.siteData.toast.show}
                               delay={3000} autohide>
                            <Toast.Body>{this.props.store.siteData.toast.text}</Toast.Body>
                        </Toast>
                    </div>
                </div>
                <LeaderBoard store={this.props.store}/>

                {this.props.store.siteData.openAssociatesPopup && <AssociatesPopup store = {this.props.store}/>}
                <div className="welcome_msg">
                    Hi {this.props.store.serverHandler.user.name+"  |  "}
                    <a className="signout" href="" onClick={() => this.props.store.serverHandler.clearUser()}>Sign out</a>
                </div>

                {this.props.store.serverHandler.user &&
                this.props.store.serverHandler.user.email !== 'admin' &&
                <img alt="" className="trophy" src={require("../../../img/trophy.png")}
                     onClick={() => this.props.store.siteData.showLeaderBoardPopup(true)}/>}

                <div className="left">
                    {this.props.store.serverHandler.user &&
                    this.props.store.serverHandler.user.email === 'admin' ?
                        <NewGameForm store = {this.props.store}/> :
                        <SubmitForm store = {this.props.store}/>}
                </div>
                <div className="right">
                    {this.props.store.serverHandler.user &&
                    this.props.store.serverHandler.user.email === 'admin' ?
                    createAdminTable(this, true) : this.createUserTable()}
                </div>
            </div>
        );
    }
}

export default MainPage;