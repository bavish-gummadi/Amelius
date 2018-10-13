import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Webcam from "react-webcam";
import Card from '@material-ui/core/Card';
import $ from 'jquery';

const styles = theme => ({
  buttonMain: {
    marginTop: 150,
  },
  mainCard: {
    background: '#d8fdff',
    height: '-webkit-fill-available',
    marginTop: 48,
    borderRadius: '15px 15px 0px 0px',
  }
});
var data = {};
var form = new FormData();
form.append("api_key", "8ixqIjxhFK2Fg_z8L-xmGRItPZxZNVa_");
form.append("api_secret", "q-lhBuleOsN3QKsNPI1Z7wA8uuIsQ0hN");
form.append("return_landmark", "1");
form.append("return_attributes", "gender,age");
class WebcamCapture extends Component {
  constructor() {
    super();
    this.state = {
      pic1: true,
      pic2: false
    }
  }
  setRef = webcam => {
    this.webcam = webcam;
  };
  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    form.append("image_base64", imageSrc);
    fetch("https://api-us.faceplusplus.com/facepp/v3/detect",
          {
              method: "POST",
              body: form
          })
          .then(function(res){ console.log(res.json().data)})
          .catch(function(res){ console.log(res) });
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
        <Webcam
          audio={false}
          height={200}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={300}
          videoConstraints={videoConstraints}
          className="webcam"
        />
        <Card className={classes.mainCard}>
          <Button variant="contained" color="secondary" className={classes.buttonMain} onClick={this.capture}>Capture Photo!</Button>
        </Card>
      </div>
    )
  }

}

WebcamCapture.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(WebcamCapture);
