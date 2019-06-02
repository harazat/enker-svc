import React from 'react';
import { Button } from 'react-bootstrap';

import Socket from '../../socket';

class Drawing extends React.Component {
  constructor(props) {
    super(props);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.endPaintEvent = this.endPaintEvent.bind(this);
  }

  isPainting = false;
  // Different stroke styles to be used for user and guest
  userStrokeStyle = 'black';
  guestStrokeStyle = 'black';
  line = [];
  prevPos = { offsetX: 0, offsetY: 0 };

  onMouseDown({ nativeEvent }) {
    const { offsetX, offsetY } = nativeEvent;
    this.isPainting = true;
    this.prevPos = { offsetX, offsetY };
  }

  onMouseMove({ nativeEvent }) {
    if (this.isPainting) {
      const { offsetX, offsetY } = nativeEvent;
      const offSetData = { offsetX, offsetY };
      // Set the start and stop position of the paint event.
      const positionData = {
        start: { ...this.prevPos },
        stop: { ...offSetData },
      };
      // Add the position to the line array
      this.line = this.line.concat(positionData);
      this.paint(this.prevPos, offSetData, this.userStrokeStyle);
    }
  }
  endPaintEvent() {
    if (this.isPainting) {
      this.isPainting = false;
      this.sendPaintData();
    }
  }
  paint(prevPos, currPos, strokeStyle) {
    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;

    this.ctx.beginPath();
    this.ctx.strokeStyle = strokeStyle;
    // Move the the prevPosition of the mouse
    this.ctx.moveTo(x, y);
    // Draw a line to the current position of the mouse
    this.ctx.lineTo(offsetX, offsetY);
    // Visualize the line using the strokeStyle
    this.ctx.stroke();
    this.prevPos = { offsetX, offsetY };
  }
  sendPaintData() {
    Socket.users.emit('drawing-message', this.props.withUser, this.props.currentUser, this.line);
  }
  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); // Clears the canvas
    this.line = [];
  }
  componentDidMount() {
    // Here we set up the properties of the canvas element. 
    // this.canvas.width = 1000;
    // this.canvas.height = 800;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 5;

    this.canvas.width = this.container.parentElement.parentElement.offsetWidth; // grab the tab container width - bug
    window.addEventListener('resize', () => {
      this.canvas.width = this.container.offsetWidth;
    });
    Socket.connect(users => {
      users.on('drawing-message', (fromUser, line) => {
        if (Array.isArray(line) && line.length === 0) {
          this.clear();
        }
        line.forEach((position) => {
          this.paint(position.start, position.stop, this.guestStrokeStyle);
        });
      })
    });
  }
  render() {
    return (
      <div ref={el => this.container = el} style={{height: "500px", border: "1px solid black"}}>
        <Button variant="info" onClick={() => {this.clear(); this.sendPaintData()}}>Clear</Button>
        <canvas 
          ref={(ref) => (this.canvas = ref)}
          onMouseDown={this.onMouseDown}
          onMouseLeave={this.endPaintEvent}
          onMouseUp={this.endPaintEvent}
          onMouseMove={this.onMouseMove}
          id="canvas" width="100px" height="500px"></canvas>
      </div>
    )
  }
}

export default Drawing;
