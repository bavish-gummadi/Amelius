import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import firebase from './firebase.js';

const styles = theme => ({
  header: {
    fontFamily: '"Montserrat", sans-serif',
  },
  title: {
    fontFamily: '"Montserrat", sans-serif',
    fontSize: "1.2rem",
    fontWeight: "500",
    marginTop: 15,
    paddingBottom: 15,
  },
  loginCard: {
    marginTop: 120,
    margin: 30,
    background: "#5ce1e6"
  },
  loginbutton: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
  }
});

class Login extends Component {
  constructor(props) {
    super();
    this.state = {
      email: '',
      password: '',
      name: '',
      signUp: false,
    }
    this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
    this.signUpHandle = this.signUpHandle.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    firebase.database().ref('patients').on('value', (snapshot) => {
	    let accounts = snapshot.val();
      console.log(accounts);
	    for (let accounter in accounts) {
        console.log(accounter);
	    	if(this.state.email == accounts[accounter].email){
          if(this.state.password == accounts[accounter].password) {
            this.props.loginHandle(accounter);
  	    	}
        }
      }
	  });
    document.getElementById("errormsg").innerHTML = "invalid username or password";
	}
  signUpHandle(e) {
    e.preventDefault();
    this.emailAlreadyExists = false;
    const account = {
      email: this.state.email,
      password: this.state.password,
      name: this.state.name,
    }
    firebase.database().ref('patients').on('value', (snapshot) => {
	    let accounts = snapshot.val();
	    for (let accounter in accounts) {
	    	if(account.email == accounts[accounter].email){
          document.getElementById('errormsg').innerHTML = "Email Already Exists";
          this.emailAlreadyExists = true;
          break;
	    	}
	    }
	  });
    console.log(this.emailAlreadyExists);
    if(!this.emailAlreadyExists) {
      firebase.database().ref('patients').push(account).catch((error) => console.log(error));
      console.log(this.emailAlreadyExists);
    }
  }
  handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}
  render(props) {
    const { classes } = this.props;
    return (
      <div>
        {this.state.signUp ? (
          <Slide in={this.state.signUp} direction="down">
          <Card className={classes.loginCard}>
            <form>
              <Typography color="primary" className={classes.title}>Sign up to view your patient data</Typography>
              <TextField type="text" className={classes.input} name="name" placeholder="name" onChange={this.handleChange} value={this.state.name} /><br/><br/>
              <TextField type="text" className={classes.input} name="email" placeholder="e-mail" onChange={this.handleChange} value={this.state.email.toLowerCase()} /><br/><br/>
    					<TextField type="password" disableripple='true' className={classes.input} name="password" placeholder="Password" onChange={this.handleChange} value={this.state.password} /><br/><br/>
              <Button onClick={this.signUpHandle} variant='contained' color='primary' size='large'className={classes.loginbutton}>Sign Up</Button>
              <div>
                <Button variant='contained' color='primary' size='small' onClick={() => {this.setState({signUp: false})}}className={classes.loginbutton}>LOGIN</Button>
              </div>
              <p id="errormsg"></p>
            </form>
          </Card>
          </Slide>
        ) : (
          <Slide in={!this.state.signUp} direction="down">
          <Card className={classes.loginCard}>
            <form>
              <Typography color="primary" className={classes.title}>Sign in to view your patient data</Typography>
              <TextField type="text" className={classes.input} name="email" placeholder="e-mail" onChange={this.handleChange} value={this.state.email.toLowerCase()} /><br/><br/>
    					<TextField type="password" disableripple='true' className={classes.input} name="password" placeholder="Password" onChange={this.handleChange} value={this.state.password} /><br/><br/>
              <Button onClick={this.handleSubmit} variant='contained' color='primary' size='large'className={classes.loginbutton}>LOG IN</Button>
              <div>
                <Button variant='contained' color='primary' size='small' onClick={() => {this.setState({signUp: true})}} className={classes.loginbutton}>Sign Up</Button>
              </div>
              <p id="errormsg"></p>
            </form>
          </Card>
          </Slide>
        )}
      </div>
    )
  }

}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Login);
