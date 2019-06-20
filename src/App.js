import React, { Component, Fragment } from 'react';
import logo from './logo.svg';
import TopNavigationBar from "./TopNavigationBar.js";
import WebcamCapture from "./WebcamCapture.js";
import Login from "./Login.js";
import firebase from './firebase.js';
import GraphsHome from './GraphsHome.js'
import {Redirect, Route }from 'react-router-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './App.css';
require('typeface-montserrat')


const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#ffffff',
      main: '#ffffff',
      dark: '#ffffff',
      contrastText: '#43b6ba',
    },
    secondary: {
      light: '#5ce1e6',
      main: '#5ce1e6',
      dark: '#5ce1e6',
      contrastText: '#ffffff',
    },
    error: {
      light: '#5ce1e6',
      main: '#5ce1e6',
      dark: '#5ce1e6',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Montserrat", sans-serif',
  },
});

class App extends Component {
  constructor() {
    super();
    this.loginHandle = this.loginHandle.bind(this);

    this.state = {
      loggedIn: false,
      userId: '',
      imaging: false,
      stage: 0
    }
  }
  loginHandle = (userId) => {
    this.setState({
      loggedIn: true,
      userId: userId
    });
  }
  incrementStage = () => {
    this.setState({
      stage: ++this.state.stage
    })
  }
  resetStage = () => {
    this.setState({
      stage: 0
    })
  }
  imagingToggle = () => {
    this.setState({imaging: !this.state.imaging})
  }
  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };
    return (
      <div className="App">
        <Router>
        <MuiThemeProvider theme={theme}>
          {this.state.loggedIn ? (
              <Fragment>
                <TopNavigationBar
                  imaging={this.state.imaging}
                  imagingToggle={this.imagingToggle.bind(this)}
                  stage={this.state.stage}
                />
                <Redirect to='/graphsHome'/>
              </Fragment>
          ) : (
            <Fragment>
              <Redirect to='/login'/>
            </Fragment>
          )}

          <Route path="/graphsHome" component={(props) =>
            <GraphsHome
              userId={this.state.userId}
            />
          }/>
          <Route path="/data" render={(props) =>
            <WebcamCapture
              userId={this.state.userId}
              imagingToggle={this.imagingToggle.bind(this)}
              stage={this.state.stage}
              incrementStage={this.incrementStage.bind(this)}
              resetStage={this.resetStage.bind(this)}
            />
          }/>
          <Route path="/login" render={(props) =>
            <Login
              loginHandle={this.loginHandle.bind(this)}
            />
          }/>
        </MuiThemeProvider>
        </Router>

      </div>
    );
  }

}


export default App;
