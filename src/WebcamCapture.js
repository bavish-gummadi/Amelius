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
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, VerticalGridLines} from 'react-vis';
import firebase from './firebase.js';

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
	},
  tester: {
    marginTop: 70,
  },
  graph: {
    marginTop: 80,
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
      retake: false,
      midLipDifference: '',
      rightLipDifference: '',
      leftLipDifference: '',

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
              this.setState({pic1: true});
            })
            .catch((error) => {
                console.log(error);
                this.setState({pic1: false});
            });
        clearInterval(timing);
    }, 3000)

  };
  capture2 = () => {
    this.setState({timer: 3});
    var timing = setInterval(() => {
      var time = this.state.timer;
      --time;
      this.setState({timer: time});
    },1000);
    this.timeout2 = setTimeout(() => {
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
              this.processData();
            })
            .catch((res) => {
              console.log(res)
              this.setState({pic2: false});
            });
        clearInterval(timing);
    }, 3000)
  };
  processData() {
      //ADMINISTER ALGORITHMS FROM RESEARCH PAPER
      var data1EyeLeft = {
        x: ((data1.left_eye_bottom.x + data1.left_eye_top.x)/2.0),
        y: ((data1.left_eye_bottom.y + data1.left_eye_top.y)/2.0),
      }
      var data1EyeRight = {
        x: ((data1.right_eye_bottom.x + data1.right_eye_top.x)/2.0),
        y: ((data1.right_eye_bottom.y + data1.right_eye_top.y)/2.0),
      }
      var data2EyeRight = {
        x: ((data2.right_eye_bottom.x + data2.right_eye_top.x)/2.0),
        y: ((data2.right_eye_bottom.y + data2.right_eye_top.y)/2.0),
      }
      var data2EyeLeft = {
        x: ((data2.left_eye_bottom.x + data2.left_eye_top.x)/2.0),
        y: ((data2.left_eye_bottom.y + data2.left_eye_top.y)/2.0),
      }
      var data1EyeDistance = Math.pow(Math.pow(data1EyeLeft.x - data1EyeRight.x, 2) + Math.pow(data1EyeLeft.y - data1EyeRight.y, 2), 0.5);
      var data2EyeDistance = Math.pow(Math.pow(data2EyeLeft.x - data2EyeRight.x, 2) + Math.pow(data2EyeLeft.y - data2EyeRight.y, 2), 0.5);
      var fixing_ratio = data1Distance/data2Distance;
      var data1Distance;
      var data2Distance;
      //The following are the deltas we like to keep track of

      //Mid lip difference
      data1Distance = Math.pow(Math.pow(data1.mouth_upper_lip_top.x - data1.mouth_lower_lip_bottom.x, 2) + Math.pow(data1.mouth_upper_lip_top.y - data1.mouth_lower_lip_bottom.y, 2), 0.5);
      data2Distance = Math.pow(Math.pow(data2.mouth_upper_lip_top.x - data2.mouth_lower_lip_bottom.x, 2) + Math.pow(data2.mouth_upper_lip_top.y - data2.mouth_lower_lip_bottom.y, 2), 0.5);
      var midLipDifference = Math.abs(100*(data1Distance/data1EyeDistance) - 100*(data2Distance/data2EyeDistance));

      //find midpoint of mouth

      var data1CMouthMid = {
        x: ((data1.mouth_lower_lip_top.x + data1.mouth_upper_lip_bottom.x)/2.0),
        y: ((data1.mouth_lower_lip_top.y + data1.mouth_upper_lip_bottom.y)/2.0),
      }
      var data2NMouthMid = {
        x: ((data2.mouth_lower_lip_top.x + data2.mouth_upper_lip_bottom.x)/2.0),
        y: ((data2.mouth_lower_lip_top.y + data2.mouth_upper_lip_bottom.y)/2.0),
      }

      //Now compare the deltas of the extreme right and left part of the lip with the midpoint
      data1Distance = Math.pow(Math.pow(data1.mouth_right_corner.x - data1CMouthMid.x, 2) + Math.pow(data1.mouth_right_corner.y - data1CMouthMid.y, 2), 0.5);
      data2Distance = Math.pow(Math.pow(data2.mouth_right_corner.x - data2NMouthMid.x, 2) + Math.pow(data2.mouth_right_corner.y - data2NMouthMid.y, 2), 0.5);
      var rightLipDifference = Math.abs(100*(data1Distance/data1EyeDistance) - 100*(data2Distance/data2EyeDistance));

      data1Distance = Math.pow(Math.pow(data1.mouth_left_corner.x - data1CMouthMid.x, 2) + Math.pow(data1.mouth_left_corner.y - data1CMouthMid.y, 2), 0.5);
      data2Distance = Math.pow(Math.pow(data2.mouth_left_corner.x - data2NMouthMid.x, 2) + Math.pow(data2.mouth_left_corner.y - data2NMouthMid.y, 2), 0.5);
      var leftLipDifference = Math.abs(100*(data1Distance/data1EyeDistance) - 100*(data2Distance/data2EyeDistance));

      //Now look at deltas in eyebrows with regards to eyes
      data1Distance = Math.pow(Math.pow(data1.right_eyebrow_upper_middle.x - data1EyeRight.x, 2) + Math.pow(data1.right_eyebrow_upper_middle.y - data1EyeRight.y, 2), 0.5);
      data2Distance = Math.pow(Math.pow(data2.right_eyebrow_upper_middle.x - data2EyeRight.x, 2) + Math.pow(data2.right_eyebrow_upper_middle.y - data2EyeRight.y, 2), 0.5);
      var rightBrowDifference = Math.abs(100*(data1Distance/data1EyeDistance) - 100*(data2Distance/data2EyeDistance));

      data1Distance = Math.pow(Math.pow(data1.left_eyebrow_upper_middle.x - data1EyeLeft.x, 2) + Math.pow(data1.left_eyebrow_upper_middle.y - data1EyeLeft.y, 2), 0.5);
      data2Distance = Math.pow(Math.pow(data2.left_eyebrow_upper_middle.x - data2EyeLeft.x, 2) + Math.pow(data2.left_eyebrow_upper_middle.y - data2EyeLeft.y, 2), 0.5);
      var leftBrowDifference = Math.abs(100*(data1Distance/data1EyeDistance) - 100*(data2Distance/data2EyeDistance));

      this.state.processedData = {
        "midLipDifference": midLipDifference,
        "rightLipDifference": rightLipDifference,
        "leftLipDifference": leftLipDifference,
        "rightBrowDifference": rightBrowDifference,
        "leftBrowDifference": leftBrowDifference,
      }
      const itemsRef = firebase.database().ref('patients/' + this.props.userId );
      itemsRef.push(this.state.processedData);
      this.setState({
        currentItem: '',
        username: '',
        pic2: true
      });
      console.log(this.state.processedData);

  }
  graphData() {
    var data = [];
    var iterator = 0;
    firebase.database().ref('patients/' + this.props.userId).on('value', (snapshot) => {
      snapshot.forEach(function(childSnapshot) {
        if(childSnapshot.key[0] == '-') {
          var key = childSnapshot.key;
          // childData will be the actual contents of the child
          var childData = childSnapshot.val();
          data.push({x: iterator, y: childData.leftLipDifference});
          console.log(childData.leftLipDifference);
          ++iterator;
        }
      });
	  });
    return data;
  }
  render(props) {
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
              <Fragment>
                <Typography color="primary" className={classes.graph}>Hi, is a rundown of your progress</Typography>
                <XYPlot
                  width={300}
                  height={300}
                  color='white'>
                  <LineSeries
                    color="white"
                    data={this.graphData()}/>
                  <XAxis />
                  <YAxis title='difference score' />
                </XYPlot>
              </Fragment>
            ) : (
              <Fade in={this.state.pic1} timeout={700}>
                <div>
                  <Typography color="primary" className={classes.cardheader}>Next, you can take another picture of yourself for further information</Typography>
                  <Typography color="primary" className={classes.cardheader}>For the best data, please look at the camera directly and do not tilt your head</Typography>
                  <div>
                    <Typography color="primary" className={classes.subheader}>Please maintain a straight face and tap the button above when you are ready to capture your data</Typography>
                    <SentimentDissatisfied color="primary" className={classes.icon}/>
                  </div>
                  {this.state.timer > 0 ? (
                    <Typography variant="h1" color="primary">{this.state.timer}</Typography>
                  ):
                  <Button variant="contained" color="secondary" className={classes.buttonMain} onClick={this.capture2}>Capture Photo!</Button>
                  }
                  <p id="error2"></p>
                </div>
              </Fade>
            )
            }
            </Fragment>

          ) : (
            <Fragment>
              <Typography color="primary" className={classes.cardheader}>Hi, we're Amelius. We're here to help you track your progress. Please follow the instruections below</Typography>
              <Typography color="primary" className={classes.cardheader}>For the best data, please look at the camera directly and do not tilt your head</Typography>
              <div>
                <Typography color="primary" className={classes.subheader}>Please smile and raise your eyebrows and tap the button above when you are ready to capture your data</Typography>
                <SentimentSatisfiedAlt color="primary" className={classes.icon}/>
              </div>
              {this.state.timer > 0 ? (
                <Typography variant="h1" color="primary">{this.state.timer}</Typography>
              ):
              <Button variant="contained" color="primary" className={classes.buttonMain} onClick={this.capture1}>Capture Photo!</Button>
              }
            </Fragment>
          )}
          <p id="error"></p>
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
