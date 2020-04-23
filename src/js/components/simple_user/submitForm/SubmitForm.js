import React from 'react';
import {DropdownButton, Dropdown, Button} from 'react-bootstrap';
import {observer} from 'mobx-react';
import './submitForm.sass';

@observer
class SubmitForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            game: {name:'Choose game'}
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
    }

    onFormSubmit(e) {
        e.preventDefault(); // Stop form submit

        if(!this.state.game._id || this.state.file === null)
            this.props.store.siteData.setToast('Can\'t submit, please fill all fields...');
        else
            this.fileUpload(this.state.file);
    }

    onChange(e) {
        this.setState({file: e.target.files[0]})
    }

    async fileUpload(file) {
        const formData = new FormData();
        formData.append('game_id', this.state.game._id);
        formData.append('group_ids', this.props.store.serverHandler.user.id+
            (this.props.store.siteData.selectedAssociates.length > 0 ? ','
            +this.props.store.siteData.selectedAssociates.map(i => i.id).join(', ') : null));
        formData.append('agent', file);
        const config = {
            headers: {
                'content-type': 'application/json'
            }
        };

        this.props.store.siteData.setLoading(true);
        let success = true;
        await this.props.store.serverHandler.submitAssignment(formData, config)
            .catch(err=> {
                this.props.store.siteData.setToast('Submission failed, please try again...');
                success = false;
            });

        if(success) {
            this.props.store.siteData.selectedAssociates = [];
            await this.setState({
                file: null,
                game: {name:'Choose game'}
            });
            this.props.store.siteData.setLoading(false);
            this.props.store.siteData.setToast('Submitted successfully');
            this.props.store.serverHandler.getUserAssignments();
        }
        else
            this.props.store.siteData.setLoading(false);
    }

    render() {
        let games = this.props.store.serverHandler.games ? this.props.store.serverHandler.games : [];
        return (
            <div>
              <form onSubmit={this.onFormSubmit}>
                <h2>Submit Assignment</h2>
                <DropdownButton variant="secondary" className="form-component" title={this.state.game.name}>
                    {games.map(g => <Dropdown.Item key={g._id} onClick={() => this.setState({game: g})}>{g.name}</Dropdown.Item>)}
                </DropdownButton>
                <Button className="form-component form-button" onClick={() => this.props.store.siteData.showAssociatePopup(true)}>+ Add Associates</Button>
                  {this.props.store.siteData.selectedAssociates.length>0 &&
                      <div>Chosen associates: {this.props.store.siteData.selectedAssociates.map(i => i.name).join(', ')} </div>}
                <br/><Button onClick={() => this.inputElement.click()}>Upload</Button>
                <p>{this.state.file && this.state.file.name}</p>
                <input className="form-component hidden"
                       type="file"
                       ref={input => this.inputElement = input}
                       onChange={this.onChange}
                       accept=".pkl,.pickle"/>
                <Button className="form-component form-button" type="submit">Submit</Button>
              </form>
            </div>
        )
    }
}

export default SubmitForm;
