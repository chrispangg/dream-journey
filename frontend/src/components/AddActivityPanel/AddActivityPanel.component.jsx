import React, { useState, useContext } from 'react';
import { Container, Button, Box, TextField } from '@material-ui/core';
import { TripDetailsContext } from '../../pages/TripDetailsProvider';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import throttle from 'lodash/throttle';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';

const AddActivityPanel = () => {
  const useStyles = makeStyles((theme) => ({
    icon: {
      color: theme.palette.text.secondary,
      marginRight: theme.spacing(2),
    },
  }));

  const { addActivity, tripId, tripLongLat, SetSelectedLocation } = useContext(
    TripDetailsContext
  );
  const [activity, SetActivity] = useState({
    tripId: tripId,
    activity: '',
    startDate: '2021-04-01',
    endDate: '2021-04-02',
    startTime: '07:30',
    finishTime: '08:30',
    longitude: null,
    latitude: null,
    location: '',
    notes: '',
  });

  console.log(activity);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    SetActivity({ ...activity, [name]: value });
    console.log(activity);
  };

  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX;
  const classes = useStyles();
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);

  console.log(value);
  console.log(options);

  const fetch = React.useMemo(
    () =>
      throttle(async (input, callback) => {
        const locationURI = encodeURIComponent(input.input);
        const tripLocation = input.tripLocation;
        console.log(tripLocation);

        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${locationURI}.json?limit=7&types=country,place,region,poi,neighborhood,locality,address&access_token=${
            mapboxgl.accessToken
          }&proximity=${encodeURIComponent(
            tripLocation[0].toString()
          )},${encodeURIComponent(tripLocation[1].toString())}`
        );
        console.log(response);
        callback(response.data.features);
      }, 200),
    []
  );

  React.useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue, tripLocation: tripLongLat }, (results) => {
      console.log(results);
      if (active) {
        let newOptions = [];
        if (value) {
          newOptions = [value];
        }
        if (results) {
          newOptions = [...newOptions, ...results];
        }
        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Container maxWidth="md">
      <Box p={3} borderRadius={15}>
        <Box display="flex" alignItems="center">
          <Box width="100%">
            <TextField
              label="Activity"
              variant="outlined"
              fullWidth
              margin="dense"
              size="medium"
              name="activity"
              onInput={handleInputChange}
              value={activity.activity}
            />
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <Box width="50%" mr={2}>
            <TextField
              label="Start Date"
              variant="outlined"
              type="date"
              fullWidth
              margin="dense"
              size="medium"
              InputLabelProps={{
                shrink: true,
              }}
              name="startDate"
              onChange={handleInputChange}
              value={activity.startDate}
            />
          </Box>
          <Box width="50%" ml={2}>
            <TextField
              label="End Date"
              variant="outlined"
              type="date"
              fullWidth
              margin="dense"
              size="medium"
              InputLabelProps={{
                shrink: true,
              }}
              name="endDate"
              onChange={handleInputChange}
              value={activity.endDate}
            />
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <Box width="50%" mr={2}>
            <TextField
              label="Start Time"
              variant="outlined"
              type="time"
              fullWidth
              margin="dense"
              size="medium"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
              name="startTime"
              onChange={handleInputChange}
              value={activity.startTime}
            />
          </Box>
          <Box width="50%" ml={2}>
            <TextField
              label="Finish Time"
              variant="outlined"
              type="time"
              fullWidth
              margin="dense"
              size="medium"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
              name="finishTime"
              onChange={handleInputChange}
              value={activity.finishTime}
            />
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <Box width="100%">
            <Autocomplete
              width="100%"
              getOptionLabel={(option) => option.text}
              filterOptions={(x) => x}
              options={options}
              autoComplete
              includeInputInList
              filterSelectedOptions
              value={value}
              onChange={(event, newValue) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
                if (newValue !== null) {
                  SetActivity({
                    ...activity,
                    location: newValue.place_name,
                    longitude: newValue.geometry.coordinates[0],
                    latitude: newValue.geometry.coordinates[1],
                  });
                  SetSelectedLocation(newValue.geometry.coordinates);
                }
              }}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="dense"
                  size="medium"
                  label="Add a location"
                  variant="outlined"
                  fullWidth
                />
              )}
              renderOption={(option) => {
                return (
                  <Grid container alignItems="center">
                    <Grid item>
                      <LocationOnIcon className={classes.icon} />
                    </Grid>
                    <Grid item xs>
                      <span key={option.id} style={{ fontWeight: 700 }}>
                        {option.text}
                      </span>
                      <Typography variant="body2" color="textSecondary">
                        {option.place_name}
                      </Typography>
                    </Grid>
                  </Grid>
                );
              }}
            />
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <Box width="100%">
            <TextField
              multiline
              rows={4}
              label="Notes"
              variant="outlined"
              fullWidth
              margin="dense"
              size="medium"
              name="notes"
              onChange={handleInputChange}
              value={activity.notes}
            />
          </Box>
        </Box>
      </Box>
      <Box mb={3} display="flex" pr={3} justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            addActivity(activity);
            SetActivity({
              tripId: tripId,
              activity: '',
              startDate: '2021-04-01',
              endDate: '2021-04-02',
              startTime: '07:30',
              finishTime: '08:30',
              longitude: null,
              latitude: null,
              location: '',
              notes: '',
            });
          }}
        >
          ADD ACTIVITY
        </Button>
      </Box>
    </Container>
  );
};

export default AddActivityPanel;
