import React, { Component } from 'react';

import { Tabs, Tab, Container, Row, Col } from 'react-bootstrap';
import './network.css';
import Socket from '../../socket';

// Chat
import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

// WYSIWIG
import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
import debounce from 'debounce';

// Drawing
import Drawing from './Drawing';

// VideoChat
import VideoChat from './VideoChat';

class NetworkPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatMessages:[],
      editorText: '',
    };

    this.handleNewChatMessage = this.handleNewChatMessage.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
  }
  handleNewChatMessage(message) {
    this.emitChatMessage(message);
  }
  handleEditorChange(source, editor) {
    console.log('source', source);
    if (source === 'user') {
      this.emitEditorMessage(editor.getContents());
    }
  }
  emitChatMessage(message) {
    Socket.users.emit('chat-message', this.props.withUser, this.props.currentUser, message);
  }
  emitEditorMessage(message) {
    Socket.users.emit('editor-message', this.props.withUser, this.props.currentUser, message);
  }
  componentDidMount() {
    addResponseMessage(`Message ${this.props.withUser ? this.props.withUser.firstName: ''}!`)
    Socket.connect(users => {
      users.on('chat-message', (fromUser, message) => {
        addResponseMessage(message);
        this.setState((prevState) => ({
          chatMessages: [...prevState.chatMessages, message]
        }));
      });
      users.on('editor-message', (fromUser, message) => {
        this.setState({
          editorText: message
        })
      });
    });
  }
  componentWillUnmount() {
    Socket.users.removeListener('chat-message');
    Socket.users.removeListener('editor-message');
  }
  render() {
    return (
      <Container fluid={true} className="p-0">
        <Widget
          title='TUMO Chat'
          subtitle={`Chat with ${this.props.withUser ? this.props.withUser.firstName: ''}!`}
          handleNewUserMessage={this.handleNewChatMessage}
        />
        <Row noGutters={true}>
          <Col>
            <Tabs defaultActiveKey="editor" id="uncontrolled-tab-example">
              <Tab eventKey="editor" title="Editor">
                <ReactQuill
                  id="chat"
                  value={this.state.editorText}
                  onChange={(content, delta, source, editor) => { debounce(this.handleEditorChange(source, editor)) } }
                />
              </Tab>
              <Tab eventKey="canvas" title="Canvas">
                <Drawing withUser={this.props.withUser} currentUser={this.props.currentUser} />
              </Tab>
            </Tabs>            
          </Col>
          <Col>
            <div>
              {this.props.withUser ?
                <VideoChat
                  currentUser={this.props.currentUser}
                  caller={this.props.receiver ? this.props.withUser : this.props.currentUser}
                  receiver={this.props.receiver ? this.props.currentUser : this.props.withUser}
                /> : null
              }
            </div>
          </Col>
        </Row>

      </Container>
    )
  }
}

export default NetworkPage;
