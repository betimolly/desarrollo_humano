import React, { Component } from 'react';
import { Typography, Box } from '@material-ui/core';


class TabPanel extends Component {
  render() {
    const { children, value, index, ...other} = this.props;

    return (
      <Typography 
        component="div" 
        role="tabpanel" 
        hidden={value !== index} 
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        <Box p={3}>{children}</Box>
      </Typography>
    );
  }
}

export default TabPanel;