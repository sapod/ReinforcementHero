import React, { Component } from 'react';
import { Modal, Dropdown, DropdownButton, Table } from 'react-bootstrap';
import {observer} from 'mobx-react';

@observer
class LeaderBoardPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game: 'Choose game'
        };
        if(this.props.store.serverHandler.games.length === 0)
            this.props.store.serverHandler.getGames();
    }
    close = () => this.props.store.siteData.showLeaderBoardPopup(false);

    gameChanged(g) {
        this.setState({game: g.name});
        this.props.store.serverHandler.getAdminAllAssignments(g._id);
    }

    static createAdminTable(self,isAdmin) {
        let games = self.props.store.serverHandler.games ? self.props.store.serverHandler.games : [];

        return (
            <div>
                <DropdownButton className="dropdown-_center" variant="secondary" title={self.state.game}>
                    {games.map(g => <Dropdown.Item key={g._id}
                                                   onClick={self.gameChanged.bind(self, g)}>{g.name}</Dropdown.Item>)}
                </DropdownButton>
                <br/>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>User Names</th>
                        {/*<th>User Emails</th>*/}
                        {isAdmin&&<th>Submission Date</th>}
                        <th>Score</th>
                    </tr>
                    </thead>
                    <tbody>
                    {self.props.store.serverHandler.all_assignment_submissions &&
                    self.props.store.serverHandler.all_assignment_submissions
                        .sort(function(a, b){return b.scores.simpleAvg - a.scores.simpleAvg}).map((s, i) => (
                        <tr>
                            <td>{i+1}</td>
                            <td>{s.group_names.join(',')}</td>
                            {/*<td>/!*s.user_emails.join(', ')*!/</td>*/}
                            {isAdmin&&<td>{s.submission_date}</td>}
                            <td>{s.scores.simpleAvg}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
        );
    }

    render() {
        return (
            <div>
                <Modal size="lg" show={this.props.store.siteData.openLeaderBoardPopup} onHide={this.close.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Leader Board</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {LeaderBoardPopup.createAdminTable(this)}
                    </Modal.Body>
                </Modal>
            </div>

        )
    }
}

export default LeaderBoardPopup;
const createAdminTable = LeaderBoardPopup.createAdminTable;
export {createAdminTable};