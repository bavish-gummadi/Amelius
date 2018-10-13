import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Webcam from "react-webcam";
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import SentimentSatisfiedAlt from '@material-ui/icons/SentimentSatisfiedAlt'
import SentimentDissatisfied from '@material-ui/icons/SentimentDissatisfied'
import Fade from '@material-ui/core/Fade';
import Check from '@material-ui/icons/Check';
import './WebcamCapture.css';
import $ from 'jquery';

const styles = theme => ({
  buttonMain: {
    marginTop: 50,
  },
  mainCard: {
    background: '#43b6ba',
    height: '-webkit-fill-available',
    borderRadius: '15px 15px 0px 0px',
  },
  cardheader: {
    paddingTop: 70,
  },
  subheader: {
    paddingTop: 25,
  },
  icon: {
    fontSize: 45,
  },
  check: {
		color: '#FFFFFF',
		fontSize: 250,
		margin: theme.spacing.unit * 2,
		marginTop: 250,
	}
});
var data1 = {};
var data2 = {};
var form1 = new FormData();
var form2 = new FormData();
form1.append("api_key", "8ixqIjxhFK2Fg_z8L-xmGRItPZxZNVa_");
form1.append("api_secret", "q-lhBuleOsN3QKsNPI1Z7wA8uuIsQ0hN");
form1.append("return_landmark", "1");
form1.append("return_attributes", "gender,age");

form2.append("api_key", "8ixqIjxhFK2Fg_z8L-xmGRItPZxZNVa_");
form2.append("api_secret", "q-lhBuleOsN3QKsNPI1Z7wA8uuIsQ0hN");
form2.append("return_landmark", "1");
form2.append("return_attributes", "gender,age");
class WebcamCapture extends Component {
  constructor() {
    super();
    this.state = {
      pic1: false,
      pic2: false,
      timer: 0,
      isLoading: false,
    }
  }
  componentWillUnmount() {
    clearInterval(this.timeout1);
    clearInterval(this.timeout2);
  }
  setRef = webcam => {
    this.webcam = webcam;
  };
  capture1 = () => {
    this.setState({timer: 3});
    var timing = setInterval(() => {
      console.log(this.state.timer);
      var time = this.state.timer;
      --time;
      this.setState({timer: time});
    },1000);
    this.timeout1 = setTimeout(() => {
      const imageSrc = this.webcam.getScreenshot();
      form1.append("image_base64", imageSrc);
      fetch("https://api-us.faceplusplus.com/facepp/v3/detect",
            {
                method: "POST",
                body: form1
            })
            .then(dataWrappedByPromise => dataWrappedByPromise.json())
            .then(data => {
              data1 = data.faces[0].landmark;
            })
            .catch(function(res){ console.log(res) });
        this.setState({pic1: true});
        clearInterval(timing);
    }, 3000)

  };
  capture2 = () => {
    this.setState({timer: 3});
    var timing = setInterval(() => {
      console.log(this.state.timer);
      var time = this.state.timer;
      --time;
      this.setState({timer: time});
    },1000);
    this.timeout2 = setTimeout(() => {
      this.setState({pic2: true});
      const imageSrc = this.webcam.getScreenshot();
      form2.append("image_base64", imageSrc);
      fetch("https://api-us.faceplusplus.com/facepp/v3/detect",
            {
                method: "POST",
                body: form2
            })
            .then(dataWrappedByPromise => dataWrappedByPromise.json())
            .then(data => {
              data2 = data.faces[0].landmark;
            })
            .catch(function(res){ console.log(res) });
        clearInterval(timing);
    }, 3000)

  };
  render() {
    const { classes } = this.props;
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };
    return (
      <div>
        <Card className={classes.mainCard}>
          {this.state.pic1 ? (
            <Fragment>
            {this.state.pic2 ? (
              <Fade in={this.state.pic1} timeout={700}>
                <Check className={classes.check}/>
              </Fade>
            ) : (
              <Fade in={this.state.pic1} timeout={700}>
                <div>
                  <Typography color="primary" className={classes.cardheader}>Next, you can take another picture of yourself for further information</Typography>
                  {this.state.timer > 0 ? (
                    <Typography variant="h1" color="primary">{this.state.timer}</Typography>
                  ):
                  <Button variant="contained" color="secondary" className={classes.buttonMain} onClick={this.capture2}>Capture Photo!</Button>
                  }
                  <div>
                    <Typography color="primary" className={classes.subheader}>Please maintain a straight face and tap the button above when you are ready to capture your data</Typography>
                    <SentimentDissatisfied color="primary" className={classes.icon}/>
                  </div>
                </div>
              </Fade>
            )
            }
            </Fragment>

          ) : (
            <Fragment>
              <Typography color="primary" className={classes.cardheader}>Hi, we're Amelius. We're here to help you track your progress. Please follow the instruections below</Typography>
              {this.state.timer > 0 ? (
                <Typography variant="h1" color="primary">{this.state.timer}</Typography>
              ):
              <Button variant="contained" color="secondary" className={classes.buttonMain} onClick={this.capture1}>Capture Photo!</Button>
              }
              <div>
                <Typography color="primary" className={classes.subheader}>Please Smile and tap the button above when you are ready to capture your data</Typography>
                <SentimentSatisfiedAlt color="primary" className={classes.icon}/>
              </div>
            </Fragment>
          )}
          <Webcam
            audio={false}
            height={200}
            ref={this.setRef}
            screenshotFormat="image/jpeg"
            width={300}
            videoConstraints={videoConstraints}
            className="webcam"
          />
        </Card>
      </div>
    )
  }

}

WebcamCapture.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(WebcamCapture);
