import React, { Component } from "react";
import './main.sass';
import ReactFileUpload from '../ReactFileUpload';
import { Table } from 'react-bootstrap';

class MainPage extends Component {
    render() {
        return (
            <div>
                <div className="left">
                    <ReactFileUpload/>
                </div>
                <div className="right">
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>1</td>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td colSpan="2">Larry the Bird</td>
                            <td>@twitter</td>
                        </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }
}

export default MainPage;