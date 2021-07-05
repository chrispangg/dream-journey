import React from 'react';
import {
  Container,
  Tab,
  Tabs,
  Box,
  Typography,
  Paper,
} from '@material-ui/core';
import AddActivityPanel from '../AddActivityPanel/AddActivityPanel.component';
import AddStayPanel from '../AddStayPanel/AddStayPanel.component';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="span">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

export default function CombinedPanel() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container className={classes.root}>
      <Paper elevation={3}>
        <Box position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab label="Add Stay" {...a11yProps(0)} />
            <Tab label="Add Activity" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <AddStayPanel />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <AddActivityPanel />
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
      </Paper>
    </Container>
  );
}
