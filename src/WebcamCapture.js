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
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Link } from 'react-router-dom';
import './WebcamCapture.css';
import $ from 'jquery';
import firebase from './firebase.js';

const styles = theme => ({
  buttonMain: {
    marginTop: 50,
  },
  bottomNav: {
    background: "#FFFFFF",
    position: 'absolute',
    bottom: 0,
    width: '-webkit-fill-available'
  },
  mainCard: {
    background: '#43b6ba',
    height: '-webkit-fill-available',
    borderRadius: '15px 15px 0px 0px',
    overflow: 'scroll'
  },
  cardheader: {
    paddingTop: 120,
  },
  subheader: {
    paddingTop: 25,
  },
  icon: {
    fontSize: 90,
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
    fontSize: '2.0rem'
  },
  buttonsecondary: {
    margin: 10,
  },
  nocam: {
    opacity: 0,
  },
  chart: {
    height: '-webkit-fill-available',
  }
});

var data1 = {};
var data2 = {};


var form1 = new FormData();
var form2 = new FormData();
form1.set("api_key", "8ixqIjxhFK2Fg_z8L-xmGRItPZxZNVa_");
form1.set("api_secret", "q-lhBuleOsN3QKsNPI1Z7wA8uuIsQ0hN");
form1.set("return_landmark", "1");
form1.set("return_attributes", "gender,age");

form2.set("api_key", "8ixqIjxhFK2Fg_z8L-xmGRItPZxZNVa_");
form2.set("api_secret", "q-lhBuleOsN3QKsNPI1Z7wA8uuIsQ0hN");
form2.set("return_landmark", "1");
form2.set("return_attributes", "gender,age");
class WebcamCapture extends Component {
  constructor() {
    super();
    this.state = {
      pic1: false,
      pic2: false,
      timer: 0,
      isLoading: false,
      retake: false,
      cameraActive: true,
      processedData: {
        "midLipDifference": 0,
        "rightLipDifference": 0,
        "leftLipDifference": 0,
        "rightBrowDifference": 0,
        "leftBrowDifference": 0,
      },
      improvement: {
        "midLipImp": 0,
        "leftLipImp": 0,
        "rightLipImp": 0,
        "leftBrowImp": 0,
        "rightBrowImp": 0,
        "totalImp": 0,
      },
    }
  }
  componentWillUnmount() {
    clearInterval(this.timeout1);
    clearInterval(this.timeout2);
  }
  setRef = webcam => {
    this.webcam = webcam;
  };
  finalProcess = () => {
    const itemsRef = firebase.database().ref('patients/' + this.props.userId );
    //Calculate previous bests and store
    //MAX Lip difference
    var MLD = 0;
    //Max brow difference
    var MBD = 0;
    //Max mid lip difference
    var MMD = 0;
    itemsRef.on('value', (snapshot) => {
      snapshot.forEach(function(childSnapshot) {
        if(childSnapshot.key[0] == '-') {
          var key = childSnapshot.key;
          // childData will be the actual contents of the child
          var childData = childSnapshot.val();
          if(childData.leftLipDifference > MLD) {
            MLD = childData.leftLipDifference;
          }
          if(childData.rightLipDifference > MLD) {
            MLD = childData.rightLipDifference;
          }
          if(childData.leftBrowDifference > MBD) {
            MBD = childData.leftBrowDifference;
          }
          if(childData.rightBrowDifference > MBD) {
            MBD = childData.rightBrowDifference;
          }
          if(childData.midLipDifference > MMD) {
            MMD = childData.midLipDifference;
          }
        }
      });
    });
    var date = new Date();
    var strDate = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
    this.setState({
      processedData: {
        "midLipDifference": this.state.processedData["midLipDifference"]/3,
        "rightLipDifference": this.state.processedData["rightLipDifference"]/3,
        "leftLipDifference": this.state.processedData["leftLipDifference"]/3,
        "rightBrowDifference": this.state.processedData["rightBrowDifference"]/3,
        "leftBrowDifference": this.state.processedData["leftBrowDifference"]/3,
        "date": strDate,
      }
    })
    itemsRef.push(this.state.processedData);
    //Now calculate improvement for this specific
    this.setState({
      improvement: {
        "midLipImp": this.state.processedData["midLipDifference"]/MMD,
        "leftLipImp": this.state.processedData["leftLipDifference"]/MLD,
        "rightLipImp": this.state.processedData["rightLipDifference"]/MLD,
        "leftBrowImp": this.state.processedData["leftBrowDifference"]/MBD,
        "rightBrowImp": this.state.processedData["rightBrowDifference"]/MBD,
        "totalImp": this.state.processedData["midLipDifference"]+
                    this.state.processedData["leftLipDifference"]+
                    this.state.processedData["rightLipDifference"]+
                    this.state.processedData["leftBrowDifference"]+
                    this.state.processedData["rightBrowDifference"]/
                    (MLD*2 + MBD*2 + MMD),
      }
    })
    //DISPLAY SOME THANK YOU AND GO BACK TO GRAPHS
  };
  capture1 = (props) => {
    this.setState({timer: 3});
    var timing = setInterval(() => {
      var time = this.state.timer;
      --time;
      this.setState({timer: time});
    },1000);
    this.timeout1 = setTimeout(() => {
      const imageSrc = this.webcam.getScreenshot();
      form1.set("image_base64", imageSrc);
      fetch("https://api-us.faceplusplus.com/facepp/v3/detect",
            {
                method: "POST",
                body: form1
            })
            .then(dataWrappedByPromise => dataWrappedByPromise.json())
            .then(data => {
              data1 = data.faces[0].landmark;
              this.props.incrementStage();
            })
            .catch((error) => {
                console.log(error);
                this.setState({pic1: false});
            });
        clearInterval(timing);
    }, 3000)

  };
  capture2 = (props) => {
    this.setState({timer: 3});
    var timing = setInterval(() => {
      var time = this.state.timer;
      --time;
      this.setState({timer: time});
    },1000);
    this.timeout2 = setTimeout(() => {
      const imageSrc = this.webcam.getScreenshot();
      form2.set("image_base64", imageSrc);
      fetch("https://api-us.faceplusplus.com/facepp/v3/detect",
            {
                method: "POST",
                body: form2
            })
            .then(dataWrappedByPromise => dataWrappedByPromise.json())
            .then(data => {
              data2 = data.faces[0].landmark;
              this.props.incrementStage();
              this.processData();
              if(this.props.stage == 6) {
                this.finalProcess();
              }
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
      //CHANGED TO SET STATE!!
      this.setState({
        processedData: {
          "midLipDifference": midLipDifference + this.state.processedData["midLipDifference"],
          "rightLipDifference": rightLipDifference + this.state.processedData["rightLipDifference"],
          "leftLipDifference": leftLipDifference + this.state.processedData["leftLipDifference"],
          "rightBrowDifference": rightBrowDifference + this.state.processedData["rightBrowDifference"],
          "leftBrowDifference": leftBrowDifference + this.state.processedData["leftBrowDifference"],
        }
      })
      this.setState({
        currentItem: '',
        username: '',
        pic2: true
      });
  }
  reset = () => {
    this.setState({pic1: false,
                  pic2: false});
  }
  returnGraphs = () => {
    this.props.resetStage();
    this.props.imagingToggle();
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
          {this.props.stage == 6 ? (
            <Fragment>
              <div className="totalImprovement">
                <Typography color="primary" variant='headline'>{this.state.improvement["totalImp"].toFixed(1)}%</Typography>
                <Typography color="primary" variant='subheading'>Total Improvement</Typography>
              </div>
              <div className="secondImprovement">
                <Typography color="primary" variant='headline'>{this.state.improvement["leftLipImp"].toFixed(1)}%</Typography>
                <Typography color="primary" variant='subheading'>Left Lip Improvement</Typography>
              </div>
              <div className="secondImprovement">
                <Typography color="primary" variant='headline'>{this.state.improvement["rightLipImp"].toFixed(1)}%</Typography>
                <Typography color="primary" variant='subheading'>Right Lip Improvement</Typography>
              </div>
              <div className="secondImprovement">
                <Typography color="primary" variant='headline'>{this.state.improvement["midLipImp"].toFixed(1)}%</Typography>
                <Typography color="primary" variant='subheading'>Mid Lip Improvement</Typography>
              </div>
              <div className="secondImprovement">
                <Typography color="primary" variant='headline'>{this.state.improvement["leftBrowImp"].toFixed(1)}%</Typography>
                <Typography color="primary" variant='subheading'>Left Brow Improvement</Typography>
              </div>
              <div className="secondImprovement">
                <Typography color="primary" variant='headline'>{this.state.improvement["rightBrowImp"].toFixed(1)}%</Typography>
                <Typography color="primary" variant='subheading'>Right Brow Improvement</Typography>
              </div>
            </Fragment>
          ) : (
            <Fragment>
            {this.props.stage % 2 == 0 ? (
              <Fragment>
                <Typography color="primary" className={classes.cardheader}>For the best data, please look at the camera directly and do not tilt your head</Typography>
                <div>
                  <Typography color="primary" className={classes.subheader}>Please smile and raise your eyebrows and tap the button above when you are ready to capture your data</Typography>
                  {this.state.cameraActive ? (
                    <Webcam
                      audio={false}
                      height={200}
                      ref={this.setRef}
                      screenshotFormat="image/jpeg"
                      width={300}
                      videoConstraints={videoConstraints}
                      className={classes.webcam}/>
                  ) : (
                    <SentimentSatisfiedAlt color="primary" className={classes.icon}/>
                  )}
                </div>
                {this.state.timer > 0 ? (
                  <Typography variant="h1" color="primary">{this.state.timer}</Typography>
                  ): (
                  <Fragment>
                  <Button variant="contained" color="primary" className={classes.buttonMain} onClick={this.capture1}>Capture Photo!</Button>
                  </Fragment>
                  )
                }
                <Webcam
                  audio={false}
                  height={200}
                  ref={this.setRef}
                  screenshotFormat="image/jpeg"
                  width={300}
                  videoConstraints={videoConstraints}
                  className={classes.nocam}
                />
              </Fragment>
            ) : (
              <Fade in={true} timeout={700}>
                <div>
                  <Typography color="primary" className={classes.cardheader}>Next, you can take another picture of yourself for further information</Typography>
                  <Typography color="primary" className={classes.subheader}>For the best data, please look at the camera directly and do not tilt your head</Typography>
                  <div>
                    <Typography color="primary" className={classes.subheader}>Please maintain a straight face and tap the button above when you are ready to capture your data</Typography>
                    {this.state.cameraActive ? (
                      <Webcam
                        audio={false}
                        height={200}
                        ref={this.setRef}
                        screenshotFormat="image/jpeg"
                        width={300}
                        videoConstraints={videoConstraints}
                        className={classes.webcam}
                      />
                    ) : (
                      <SentimentDissatisfied color="primary" className={classes.icon}/>
                    )}
                  </div>
                  {this.state.timer > 0 ? (
                    <Typography variant="h1" color="primary">{this.state.timer}</Typography>
                  ):
                  <Button variant="contained" color="secondary" className={classes.buttonMain} onClick={this.capture2}>Capture Photo!</Button>
                  }
                  <p id="error2"></p>
                  <Webcam
                    audio={false}
                    height={200}
                    ref={this.setRef}
                    screenshotFormat="image/jpeg"
                    width={300}
                    videoConstraints={videoConstraints}
                    className={classes.nocam}
                  />
                </div>
              </Fade>
            )}
            </Fragment>
          )}

          <p id="error"></p>
          <Tabs
            indicatorColor="secondary"
            textColor="secondary"
            fullWidth
            className={classes.bottomNav}
            >
            <Tab
              label='Return to Data'
              component={Link}
              to="/graphsHome"
              onClick={this.returnGraphs}
            />
            <Tab
              label='Toggle Camera'
              onClick={() => this.setState({cameraActive: !this.state.cameraActive})}
            />
          </Tabs>
        </Card>
      </div>
    )
  }

}

WebcamCapture.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(WebcamCapture);
