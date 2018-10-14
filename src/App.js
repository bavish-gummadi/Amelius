import React, { Component, Fragment } from 'react';
import logo from './logo.svg';
import TopNavigationBar from "./TopNavigationBar.js";
import WebcamCapture from "./WebcamCapture.js";
import Login from "./Login.js";
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
    this.state = {
      loggedIn: false,
      userId: ''
    }
  }
  loginHandle(userId) {
    this.setState({
      loggedIn: true,
      userId: userId
    });
  }
  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };
    return (
      <div className="App">
        <MuiThemeProvider theme={theme}>
          <TopNavigationBar/>
          {this.state.loggedIn ? (
              <WebcamCapture
                userId = {this.state.userId}/>
          ) : (
            <Login
              loginHandle={this.loginHandle.bind(this)}
            />
          )}

        </MuiThemeProvider>
      </div>
    );
  }
}


export default App;
