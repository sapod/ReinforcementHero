import React, { Component } from "react";
import { Redirect } from 'react-router';
import { Row, FormGroup, FormControl, FormLabel, Button, Alert } from 'react-bootstrap';
import './signup.sass';
import { isEmail, isEmpty, isLength, isContainWhiteSpace } from '../../shared/validator';

class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formData: {}, // Contains login form data
            errors: {}, // Contains login field errors
            formSubmitted: false, // Indicates submit status of login form
            signup: false,
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

    validateSignupForm(e) {
        
        let errors = {};
        const { formData } = this.state;

        if (isEmpty(formData.email)) {
            errors.email = "Email can't be blank";
        } else if (!isEmail(formData.email)) {
            errors.email = "Please enter a valid email";
        }

        if (isEmpty(formData.name)) {
            errors.name = "Name can't be blank";
        } else if(formData.name.split(' ').length < 2) {
            errors.name = "Enter first and last name";
        }

        if (isEmpty(formData.password)) {
            errors.password = "Password can't be blank";
        }  else if (isContainWhiteSpace(formData.password)) {
            errors.password = "Password should not contain white spaces";
        } else if (!isLength(formData.password, { gte: 6, lte: 16, trim: true })) {
            errors.password = "Password's length must between 6 to 16";
        }

        if(formData.passwordConfirm !== formData.password){
            errors.passwordConfirm = "Passwords are not equal";
        }

        if (isEmpty(errors)) {
            return true;
        } else {
            return errors;
        }    
    }

    signup(e) {
        
        e.preventDefault();

        let errors = this.validateSignupForm();

        if(errors === true){
            alert("Signed up successfully");
            this.setState({
                signup: true
            });
        } else {
            this.setState({
                errors: errors,
                formSubmitted: true
            });
        }
    }

    render() {
        const { errors, formSubmitted } = this.state;

        if(this.state.signup)
            return <Redirect to="/login" push={true}/>;

        return (
            <div>
                <div className="Signup">
                    <Row>
                        <form onSubmit={this.signup.bind(this)}>
                            <FormGroup controlId="email" validationState={ formSubmitted ? (errors.email ? 'error' : 'success') : null }>
                                <FormLabel>Email</FormLabel>
                                <FormControl type="text" name="email" placeholder="Enter your email" onChange={this.handleInputChange.bind(this)} />
                            { errors.email && <Alert variant="danger" bsPrefix="alert">{errors.email}</Alert> }
                            </FormGroup >
                            <FormGroup controlId="name" validationState={ formSubmitted ? (errors.email ? 'error' : 'success') : null }>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl type="text" name="name" placeholder="Enter your name" onChange={this.handleInputChange.bind(this)} />
                                { errors.name && <Alert variant="danger" bsPrefix="alert">{errors.name}</Alert> }
                            </FormGroup >
                            <FormGroup controlId="password" validationState={ formSubmitted ? (errors.password ? 'error' : 'success') : null }>
                                <FormLabel>Password</FormLabel>
                                <FormControl type="password" name="password" placeholder="Enter your password" onChange={this.handleInputChange.bind(this)} />
                            { errors.password && <Alert variant="danger" bsPrefix="alert">{errors.password}</Alert> }
                            </FormGroup>
                            <FormGroup controlId="passwordConfirm" validationState={ formSubmitted ? (errors.passwordConfirm ? 'error' : 'success') : null }>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl type="password" name="passwordConfirm" placeholder="Enter your password again" onChange={this.handleInputChange.bind(this)} />
                                { errors.passwordConfirm && <Alert variant="danger" bsPrefix="alert">{errors.passwordConfirm}</Alert> }
                            </FormGroup>
                            <Button type="submit" bsStyle="primary" className="signin">Sign-Up</Button>
                        </form>
                    </Row>
                </div>
            </div>
        )
    }
}

export default Signup;