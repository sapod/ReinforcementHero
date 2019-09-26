import React, { Component } from "react";
import { Redirect } from 'react-router';
import {observer} from 'mobx-react';
import { Row, FormGroup, FormControl, FormLabel, Button, Alert } from 'react-bootstrap';
import './login.sass';
import { isEmail, isEmpty, isLength, isContainWhiteSpace } from '../../shared/validator';

@observer
class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formData: {}, // Contains login form data
            errors: {}, // Contains login field errors
            formSubmitted: false, // Indicates submit status of login form
            signup: false
        }
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

    validateLoginForm(e) {
        
        let errors = {};
        const { formData } = this.state;

        if (isEmpty(formData.email)) {
            errors.email = "Email can't be blank";
        } else if (!isEmail(formData.email) && formData.email!=='admin') {
            errors.email = "Please enter a valid email";
        }

        if (isEmpty(formData.password)) {
            errors.password = "Password can't be blank";
        }  else if (isContainWhiteSpace(formData.password)) {
            errors.password = "Password should not contain white spaces";
        } else if (!isLength(formData.password, { gte: 6, lte: 16, trim: true })) {
            errors.password = "Password's length must between 6 to 16";
        }

        if (isEmpty(errors)) {
            return true;
        } else {
            return errors;
        }    
    }

    login(e) {
        
        e.preventDefault();

        let errors = this.validateLoginForm();

        if(errors === true){
            this.props.store.serverHandler.approveUserLogin(this.state.formData)
        } else {

            this.setState({
                errors: errors,
                formSubmitted: true
            });
        }
    }

    render() {
        if(this.state.signup)
            return <Redirect to="/signup" push={true}/>;
        if(this.props.store.serverHandler.user !== null)
            return <Redirect to="/" push={true}/>;

        const { errors, formSubmitted } = this.state;

        return (
            <div>
                <div className="Login">
                    <Row>
                        <form onSubmit={this.login.bind(this)}>
                            <FormGroup controlId="email" validationState={ formSubmitted ? (errors.email ? 'error' : 'success') : null }>
                                <FormLabel>Email</FormLabel>
                                <FormControl type="text" name="email" placeholder="Enter your email" onChange={this.handleInputChange.bind(this)} />
                            { errors.email && <Alert variant="danger" bsPrefix="alert">{errors.email}</Alert>}
                            </FormGroup >
                            <FormGroup controlId="password" validationState={ formSubmitted ? (errors.password ? 'error' : 'success') : null }>
                                <FormLabel>Password</FormLabel>
                                <FormControl type="password" name="password" placeholder="Enter your password" onChange={this.handleInputChange.bind(this)} />
                            { errors.password && <Alert variant="danger" bsPrefix="alert">{errors.password}</Alert>}
                            </FormGroup>
                            <Button type="submit" bsStyle="primary" className="signin">Sign-In</Button>
                            <br/><br/><br/>
                            <div>
                                <p className="signup-label">No user yet?</p>
                                <Button onClick={() => this.setState(...this.state, {signup:true})}>Sign Up</Button>
                            </div>
                        </form>
                    </Row>
                </div>
            </div>
        )
    }
}

export default Login;