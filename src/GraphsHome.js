import React, { Component, Fragment } from 'react';
import firebase from './firebase.js';
import {VictoryChart, VictoryLine, VictoryTheme} from 'victory';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  buttonMain: {
    marginTop: 50,
  },
  graph: {
    marginTop: 150,
    fontSize: '1.5rem'
  },
  chart: {
    height: '-webkit-fill-available',
  }
});

class GraphsHome extends Component {
  constructor(props) {
    super();
    var maxLLD = 0;
    var maxRLD = 0;
    var maxLBD = 0;
    var maxRBD = 0;
    var maxMLD = 0;
    firebase.database().ref('patients/' + props.userId).on('value', (snapshot) => {
      snapshot.forEach(function(childSnapshot) {
        if(childSnapshot.key[0] == '-') {
          var key = childSnapshot.key;
          // childData will be the actual contents of the child
          var childData = childSnapshot.val();
          if(childData.leftLipDifference > maxLLD) {
            maxLLD = childData.leftLipDifference;
          }
          if(childData.rightLipDifference > maxRLD) {
            maxRLD = childData.rightLipDifference;
          }
          if(childData.leftBrowDifference > maxLBD) {
            maxLBD = childData.leftBrowDifference;
          }
          if(childData.rightBrowDifference > maxRBD) {
            maxRBD = childData.rightBrowDifference;
          }
          if(childData.midLipDifference > maxMLD) {
            maxMLD = childData.midLipDifference;
          }
        }
      });
    });
    this.state = {
      maxLLD: Math.max(maxLLD, maxRLD),
      maxRLD: Math.max(maxLLD, maxRLD),
      maxLBD: Math.max(maxLBD, maxRBD),
      maxRBD: Math.max(maxLBD, maxRBD),
      maxMLD: maxMLD,
    }

  }
  graphData() {
    var data = [];
    var iterator = 0;
    firebase.database().ref('patients/' + this.props.userId).on('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if(childSnapshot.key[0] == '-') {
          var key = childSnapshot.key;
          // childData will be the actual contents of the child
          var childData = childSnapshot.val();
          var sum = (childData.leftLipDifference + childData.rightLipDifference + childData.leftBrowDifference + childData.rightBrowDifference + childData.midLipDifference);
          sum = (sum/(this.state.maxLLD + this.state.maxLBD + this.state.maxMLD + this.state.maxRBD + this.state.maxRLD)) * 100;
          data.push({x: childData.date, y: sum});
          ++iterator;
        }
      });
    });
    return data;
  }
  graphData1() {
    var data = [];
    var iterator = 0;
    firebase.database().ref('patients/' + this.props.userId).on('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if(childSnapshot.key[0] == '-') {
          var key = childSnapshot.key;
          // childData will be the actual contents of the child
          var childData = childSnapshot.val();
          var sum = (childData.leftLipDifference/(this.state.maxLLD)) * 100;
          data.push({x: childData.date, y: sum});
          ++iterator;
        }
      });
    });
    return data;
  }
  graphData2() {
    var data = [];
    var iterator = 0;
    firebase.database().ref('patients/' + this.props.userId).on('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if(childSnapshot.key[0] == '-') {
          var key = childSnapshot.key;
          // childData will be the actual contents of the child
          var childData = childSnapshot.val();
          var sum = (childData.rightLipDifference/(this.state.maxRLD)) * 100;
          data.push({x: childData.date, y: sum});
          ++iterator;
        }
      });
    });
    return data;
  }
  graphData3() {
    var data = [];
    var iterator = 0;
    firebase.database().ref('patients/' + this.props.userId).on('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if(childSnapshot.key[0] == '-') {
          var key = childSnapshot.key;
          // childData will be the actual contents of the child
          var childData = childSnapshot.val();
          var sum = (childData.midLipDifference/(this.state.maxMLD)) * 100;
          data.push({x: childData.date, y: sum});
          ++iterator;
        }
      });
    });
    return data;
  }
  graphData4() {
    var data = [];
    var iterator = 0;
    firebase.database().ref('patients/' + this.props.userId).on('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if(childSnapshot.key[0] == '-') {
          var key = childSnapshot.key;
          // childData will be the actual contents of the child
          var childData = childSnapshot.val();
          var sum = (childData.rightBrowDifference/(this.state.maxRBD)) * 100;
          data.push({x: childData.date, y: sum});
          ++iterator;
        }
      });
    });
    return data;
  }
  graphData5() {
    var data = [];
    var iterator = 0;
    firebase.database().ref('patients/' + this.props.userId).on('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if(childSnapshot.key[0] == '-') {
          var key = childSnapshot.key;
          // childData will be the actual contents of the child
          var childData = childSnapshot.val();
          var sum = (childData.leftBrowDifference/(this.state.maxRBD)) * 100;
          data.push({x: iterator, y: sum});
          ++iterator;
        }
      });
    });
    return data;
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Typography color="secondary" className={classes.graph}>Hi, this is a summary of your progress</Typography>
        <VictoryChart
          >
          <VictoryLine
            style={{
              data: { stroke: "#000000" },
              parent: { border: "1px solid #ccc"}
            }}
            data={this.graphData()}
          />
        </VictoryChart>

        <Typography color="secondary" className={classes.graph}>Left Corner Lip Differential</Typography>
        <VictoryChart
          >
          <VictoryLine
            style={{
              data: { stroke: "#000000" },
              parent: { border: "1px solid #ccc"}
            }}
            data={this.graphData1()}
          />
        </VictoryChart>

        <Typography color="secondary" className={classes.graph}>Right Corner Lip Differential</Typography>
        <VictoryChart
          >
          <VictoryLine
            style={{
              data: { stroke: "#000000" },
              parent: { border: "1px solid #ccc"}
            }}
            data={this.graphData2()}
          />
        </VictoryChart>

        <Typography color="secondary" className={classes.graph}>Mid Lip Differential</Typography>
        <VictoryChart
          >
          <VictoryLine
            style={{
              data: { stroke: "#000000" },
              parent: { border: "1px solid #ccc"}
            }}
            data={this.graphData3()}
          />
        </VictoryChart>

        <Typography color="secondary" className={classes.graph}>Right Brow Differential</Typography>
        <VictoryChart
          >
          <VictoryLine
            style={{
              data: { stroke: "#000000" },
              parent: { border: "1px solid #ccc"}
            }}
            data={this.graphData4()}
          />
        </VictoryChart>

        <Typography color="secondary" className={classes.graph}>Left Brow Differential</Typography>
        <VictoryChart
          >
          <VictoryLine
            style={{
              data: { stroke: "#000000" },
              parent: { border: "1px solid #ccc"}
            }}
            data={this.graphData5()}
          />
        </VictoryChart>
      </div>
    )
  }

}

GraphsHome.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(GraphsHome);
