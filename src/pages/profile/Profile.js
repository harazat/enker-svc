import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.learningTargets = ["Animation", "Game Development", "Filmmaking", "Web Development"]
    this.locations = ["Yerevan",  "Gyumri", "Stepnakert", "Dilijan"]
    this.state = {
      email: props.user ? props.user.email : '',
      firstName: props.user ? props.user.firstName: '',
      lastName: props.user ? props.user.lastName: '',
      password: props.user ? props.user.password: '',
      learningTargets: props.user ? props.user.learningTargets : [],
      location: props.user ? props.user.location : this.locations[0]
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.updateUser(this.state);
  }
  handleChange(type, value) {
    if (type === "learningTargets") {
      const valueAsArray = Array.from(value); // Convert HTMLCollections to Array
      const learningTargets = valueAsArray.filter(v => v.selected).map(v => v.value); // Filter and map to option value
      this.setState({
        learningTargets,
      })
    } else {
      this.setState({
        [type]: value
      });
    } 
  }
  render() {
    if (this.props.user == null) {
      return (
        <Redirect to={{
          pathname: '/',
        }} />
      )
    }
    return (
      <Container className="mt-3">
      <h1 class="display-4 text-secondary">Profile</h1>  <br></br> <br></br>
      <Form onSubmit={this.handleSubmit}>
  <Form.Group controlId="formBasicEmail">
    <Form.Label> First Name</Form.Label>
    <Form.Control onChange = {this.handleChange} type="email" disabled value= {this.props.user && this.props.user.firstName}/>
  </Form.Group>

  <Form.Group controlId="formBasicEmail">
    <Form.Label>Last Name</Form.Label>
    <Form.Control onChange = {this.handleChange} type="email" disabled value= {this.props.user && this.props.user.lastName}/>
  </Form.Group>

  <Form.Group controlId="formBasicPassword">
    <Form.Label>Email</Form.Label>
    <Form.Control onChange = {this.handleChange}type="email" disabled value= {this.props.user && this.props.user.email} />
  </Form.Group>

  <Form.Group controlId="formBasicEmail">
    <Form.Label>Learning Targets</Form.Label>
    <Form.Control onChange = {this.handleChange} type="email" disabled value= {this.props.user && this.props.user.learningTargets}/>
  </Form.Group>

  <Form.Group controlId="formBasicEmail">
    <Form.Label>Location</Form.Label>
    <Form.Control onChange = {this.handleChange} type="email" disabled value= {this.props.user && this.props.user.location}/>
  </Form.Group>


 
</Form>

       

        
      </Container>  

    )
  }
}

Profile.propTypes = {
  updateUser: PropTypes.func,
  user: PropTypes.object,
  userError: PropTypes.string,
}

export default Profile;
