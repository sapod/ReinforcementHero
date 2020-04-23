import React, { Component } from 'react';
import { Modal, Button, ButtonToolbar } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import './associatesPopup.sass';

class AssociatesPopup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: []
        };

        this.props.store.serverHandler.getUsers();
    }

    close = () => this.props.store.siteData.showAssociatePopup(false);

    save() {
        this.props.store.siteData.setAssociates(this.state.selected);
        this.close();
    }

    render() {
        return (
           <div>
               <Modal show={true} onHide={this.close.bind(this)}>
                   <Modal.Header closeButton>
                       <Modal.Title>Add Associates</Modal.Title>
                   </Modal.Header>
                   <Modal.Body>
                       <h3>Choose associates:</h3>
                       <Typeahead
                           defaultSelected={[]}
                           labelKey="name"
                           multiple
                           options={this.props.store.serverHandler.users
                               .filter(u => u.id !== this.props.store.serverHandler.user.id)}
                           placeholder="Choose associates..."
                           selected={this.state.selected}
                           onChange={(selected) => this.setState({selected})}
                           ref={(ref) => this._typeahead = ref}
                           renderMenuItemChildren={(option) => (
                               <div id={option.name}>
                                   {option.name}
                                   <small>{"  <"+option.email+">"}</small>
                               </div>
                           )}
                           filterBy={(option, props) => (
                               option.email.toLowerCase().indexOf(props.text.toLowerCase()) !== -1 ||
                               option.name.toLowerCase().indexOf(props.text.toLowerCase()) !== -1
                           )}
                       />
                       <ButtonToolbar style={{marginTop: '10px'}}>
                           <Button
                               className="popup-button btn-outline-secondary"
                               onClick={() => this._typeahead.clear()}>
                               Clear
                           </Button>
                       </ButtonToolbar>
                   </Modal.Body>
                   <Modal.Footer>
                       <Button variant="secondary" onClick={this.close.bind(this)}>
                           Close
                       </Button>
                       <Button variant="primary" onClick={this.save.bind(this)}>
                           Save Changes
                       </Button>
                   </Modal.Footer>
               </Modal>
            </div>

        )
    }
}

export default AssociatesPopup;