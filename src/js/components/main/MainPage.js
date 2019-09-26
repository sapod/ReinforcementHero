import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import './main.sass';
import SubmitForm from '../simple_user/submitForm/SubmitForm';
import { Table, Dropdown, DropdownButton } from 'react-bootstrap';
import AssociatesPopup from "../simple_user/associates/AssociatesPopup";
import {observer} from 'mobx-react'
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
        this.props.store.serverHandler.getGames();
    }

    createAdminTable() {
        let games = this.props.store.serverHandler.games ? this.props.store.serverHandler.games.map(g=> g.name) : [];

        return (
            <div>
                <DropdownButton variant="secondary" title={this.state.game}>
                    {games.map(g => <Dropdown.Item key={g._id}
                                                   onClick={() => this.setState({game: g})}>{g}</Dropdown.Item>)}
                </DropdownButton>
                <br/>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>User Names</th>
                        <th>User Emails</th>
                        <th>Submission Date</th>
                        <th>Score</th>
                        <th>Rank</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.store.serverHandler.all_assignment_submissions &&
                    this.props.store.serverHandler.all_assignment_submissions.filter(s => s.game === this.state.game).map(s => (
                        <tr>
                            <td>{s.users.join(', ')}</td>
                            <td>{s.user_emails.join(', ')}</td>
                            <td>{s.submission_date}</td>
                            <td>{s.score}</td>
                            <td>{s.rank}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        );
    }

    createUserTable() {
        return (
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Game</th>
                    <th>Submission Date</th>
                    <th>Rank</th>
                </tr>
                </thead>
                <tbody>
                {this.props.store.serverHandler.assignment_submissions &&
                this.props.store.serverHandler.assignment_submissions.map(s => (
                    <tr>
                        <td>{s.game}</td>
                        <td>{s.submission_date}</td>
                        <td>{s.rank}</td>
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

        if(this.props.store.serverHandler.user.email === 'admin' &&
            this.props.store.serverHandler.all_assignment_submissions === null) {
            this.props.store.serverHandler.getAdminAllAssignments();
        }
        else if(this.props.store.serverHandler.user.email !== 'admin' &&
            this.props.store.serverHandler.assignment_submissions === null) {
                    this.props.store.serverHandler.getUserAssignments();
        }

        return (
            <div>
                {this.props.store.siteData.openAssociatesPopup && <AssociatesPopup store = {this.props.store}/>}
                <div className="welcome_msg">
                    Hi {this.props.store.serverHandler.user.name+"  |  "}
                    <a className="signout" href="" onClick={() => this.props.store.serverHandler.clearUser()}>Sign out</a>
                </div>
                <div className="left">
                    {this.props.store.serverHandler.user &&
                    this.props.store.serverHandler.user.email === 'admin' ?
                        <NewGameForm store = {this.props.store}/> :
                        <SubmitForm store = {this.props.store}/>}
                </div>
                <div className="right">
                    {this.props.store.serverHandler.user &&
                    this.props.store.serverHandler.user.email === 'admin' ?
                    this.createAdminTable() : this.createUserTable()}
                </div>
            </div>
        );
    }
}

export default MainPage;