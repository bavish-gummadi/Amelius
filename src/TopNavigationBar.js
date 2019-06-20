import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
  header: {
    fontFamily: '"Montserrat", sans-serif',
  },
  title: {
    fontFamily: '"Montserrat", sans-serif',
    fontSize: "2.2rem",
    fontWeight: "500"
  },
  progress: {
    margin: 10,
    borderRadius: 40,
  },
  tabs: {
    textColor: "#FFFFFF"
  }
});

class TopNavigationBar extends Component {
  constructor() {
    super();
    this.state = {
      completed: 20
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <AppBar position="fixed" color={this.props.imaging ? ("primary") : ("secondary")} className={classes.header}>
          <Typography color={this.props.imaging ? ("secondary") : ("primary")} className={classes.title}>AMELIUS</Typography>
          {this.props.imaging ? (
            <Fragment>
            {this.props.stage == 6 ? (
              <Typography color="secondary">Patient Summary</Typography>
            ) : (
              <LinearProgress
              variant="determinate"
              color="secondary"
              className={classes.progress}
              value={this.props.stage * 17} />
            )}
            </Fragment>
          ) : (
            <Tabs
                indicatorColor="secondary"
  	            textColor="primary"
  	            fullWidth
            >
            <Tab
              label="Add Data"
              component={Link}
              classes={classes.tabs}
              to="/data/1"
              onClick={this.props.imagingToggle}
            />
            <Tab
              label="Export Data"
              component={Link}
              to="/graphsHome"
            />
            </Tabs>
          )}

        </AppBar>
      </div>
    )
  }

}

TopNavigationBar.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(TopNavigationBar);
