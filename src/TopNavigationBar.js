import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  header: {
    fontFamily: '"Montserrat", sans-serif',
  },
  title: {
    fontFamily: '"Montserrat", sans-serif',
    fontSize: "2.2rem",
    fontWeight: "500"
  }
});

class TopNavigationBar extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <AppBar position="fixed" color="secondary" className={classes.header}>
        <Typography color="primary" className={classes.title}>AMELIUS</Typography>
        </AppBar>
      </div>
    )
  }

}

TopNavigationBar.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(TopNavigationBar);
