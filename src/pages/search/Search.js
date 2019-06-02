import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Socket from '../../socket';
import {Badge, ListGroup, Tab, Form, Button, Container, Col, Row} from 'react-bootstrap';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      textSearch: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    Socket.connect(() => {})
  }
  componentDidMount() {
    this.onStudentLoggedIn();
    this.onStudentLoggedOut();
    this.query();
  }
  handleSubmit(event) {
    event.preventDefault();
    const searchText = ReactDOM.findDOMNode(this.refs.searchTextRef).value; // different put in slides
    this.query(searchText);
  }
  onStudentLoggedIn() {
    Socket.users.on('logged in', user => {
      this.query(this.state.textSearch);
    });
  }
  onStudentLoggedOut() {
    Socket.users.on('logged out', user => {
      this.query(this.state.textSearch);
    });
  }
  onstartChat(withUser) {
    this.props.startChat(withUser);
    Socket.users.emit('start-chat', withUser, this.props.currentUser);
    console.log('start-chat with user', withUser);
    this.props.history.push('/network');
  }
  query(textSearch) {
    this.setState({
      textSearch,
    });
    const currentUser = this.props.currentUser;
    Socket.users.emit('query', { search: textSearch}, (results) => {
      if (currentUser) {
        results = results.filter(r => currentUser.email !== r.email)
      }
      this.setState({
        list: results
      });
    });
  }
  render() {
    return (
      <Container>
        <Form onSubmit={this.handleSubmit}>
          <Row className="justify-content-md-center mt-4 mb-4">
            <Col xs lg={6}>
              <Form.Group>
                <Form.Control ref={"searchTextRef"} as="input" type="text"></Form.Control>
              </Form.Group>
            </Col>
            <Col md="auto">
              <Button variant="primary" type="submit">Search</Button>
            </Col>
          </Row>
          <Row>
            <Tab.Container id="search-results" defaultActiveKey="#user0">
            <Col>
              <ListGroup>
                {this.state.list.map((user, index) => (
                  <ListGroup.Item
                    eventKey={`#user${index}`}
                    as="button"
                    >
                    <span>{user.firstName} {user.lastName}</span> 
                    {user.loggedIn ? <Badge className="ml-2" variant="success">Logged In</Badge> : null}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col>
              <Tab.Content>
                {this.state.list.map((user, index) => (
                  <Tab.Pane eventKey={`#user${index}`}>
                    <div>Name: {user.firstName} {user.lastName}</div>
                    <div>Email: {user.email}</div>
                    <div>Learning Targets: {user.learningTargets.join(', ')}</div>
                    <div>Location: {user.location}</div>
                    <Button className="mt-3" onClick={(e) => { e.preventDefault(); this.onstartChat(user)}}>Start Chat</Button>
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Col>
            </Tab.Container>
          </Row>
        </Form>
      </Container>
    )
  }
}

Search.propTypes = {
  startChat: PropTypes.func,
  currentUser: PropTypes.object,
};
export default Search;