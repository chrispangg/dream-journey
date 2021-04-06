import React from 'react';
import {
  Container,
  Tab,
  Tabs,
  Box,
  Typography,
  AppBar,
  Paper,
} from '@material-ui/core';
import ActivitiesSummary from '../ActivitiesSummary/ActivitiesSummary.component';
import StaySummary from '../StaySummary/StaySummary.component';
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
    marginTop: theme.spacing(7),
  },
}));

export default function CombinedSummary() {
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
            <Tab label="Stays Summary" {...a11yProps(0)} />
            <Tab label="Activities Summary" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <StaySummary />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ActivitiesSummary />
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
      </Paper>
    </Container>
  );
}
