import React from 'react';
import ReactDOM from 'react-dom';
import VideoPlayer from './game';
import Navbar from './navbar';
import RoomList from './roomList';
import UserList from './userList';
import { Grid, Row, Col } from 'react-bootstrap';


const App = () => (
  <div>
    <Navbar />
    <div>
      <h2 className="centerDiv">Welcome to the Main Lobby</h2>
    </div>
    <Grid>
      <Row className="show-grid">
        <Col xs={12} md={2}>
          <UserList />
        </Col>
        <Col xs={12} md={8}>
          <VideoPlayer />
        </Col>
        <Col xs={12} md={2}>
          <RoomList />
        </Col>
      </Row>
    </Grid>
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));
