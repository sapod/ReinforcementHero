import React from 'react';
import ReactDOM from 'react-dom';
import { Button, FormControl, FormLabel, DropdownButton, Dropdown} from 'react-bootstrap';
import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import './newGameForm.sass';

class NewGameForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            formData: {},
            env: {name:'Choose environment'}
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);

        this.props.store.serverHandler.getGames();
        this.props.store.serverHandler.getEnvs();
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        let { formData } = this.state;
        formData[name] = value;

        this.setState({
            formData: formData
        });
    }

    async onFormSubmit(e) {
        e.preventDefault(); // Stop form submit
        let formData = this.state.formData;
        formData.env_id = this.state.env._id;

        if(!formData.env_id || !formData.name || !formData.num_of_episods || ! formData.due_date)
            this.props.store.siteData.setToast('Can\'t add game, please fill all fields...');
        else {
            console.log('adding game')
            this.props.store.siteData.setLoading(true);
            let success = true;
            await this.props.store.serverHandler.addGame(formData)
                .catch(err => {
                    this.props.store.siteData.setToast('Game adding failed, please try again...');
                    success = false;
                });
            if(success) {
                await this.setState({
                    formData: {},
                    env: {name:'Choose environment'}
                });
                if(this.form)
                    ReactDOM.findDOMNode(this.form).reset();
                this.props.store.siteData.setLoading(false);
                this.props.store.siteData.setToast('Game added successfully');
                this.props.store.serverHandler.getGames();
            }
            else
                this.props.store.siteData.setLoading(false);
        }
    }

    chooseEnv(env) {
        this.setState({env});
    }

    render() {
        const envs = this.props.store.serverHandler.envs;

        return (
            <div>
                <form ref={form => this.form = form} onSubmit={this.onFormSubmit}>
                    <h2>Add Game</h2>
                    <FormLabel className="form-component">Environment</FormLabel>
                    <DropdownButton className="form-component" variant="secondary" title={this.state.env.name}>
                        {envs.map(e => <Dropdown.Item key={e._id}
                                                       onClick={this.chooseEnv.bind(this, e)}>{e.name}</Dropdown.Item>)}
                    </DropdownButton>
                    <FormLabel className="form-component">Name</FormLabel>
                    <FormControl className="form-component" type="text" name="name" placeholder="Enter game name" onChange={this.handleInputChange.bind(this)} />
                    <FormLabel className="form-component">Episodes for Evaluation</FormLabel>
                    <FormControl className="form-component" type="number" name="num_of_episods" placeholder="Enter number of episodes" onChange={this.handleInputChange.bind(this)} />
                    <SingleDatePicker
                        className="form-component"
                        date={this.state.formData.due_date}
                        onDateChange={date => this.setState({ formData: Object.assign({}, this.state.formData, {due_date: date}) })}
                        focused={this.state.focused}
                        onFocusChange={({ focused }) => this.setState({ focused })}
                        placeholder="Due Date"
                        showDefaultInputIcon={true}
                        id="du_date"
                    />
                    <br/>
                    <Button className="form-component form-button" type="submit">Create</Button>
                </form>
            </div>
        )
    }
}

export default NewGameForm;
