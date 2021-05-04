import React, { useState, useContext, useRef, useEffect } from 'react';
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

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}));

const AddStayPanel = () => {
  const { addStay, tripId, tripLongLat, SetSelectedLocation } = useContext(
    TripDetailsContext
  );

  const [stay, SetStay] = useState({
    tripId: tripId,
    hotel: '',
    checkInDate: '2021-04-01',
    checkOutDate: '2021-04-02',
    longitude: null,
    latitude: null,
    location: '',
    notes: '',
  });

  console.log(tripLongLat);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    SetStay({ ...stay, [name]: value });
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
                  SetStay({
                    ...stay,
                    hotel: newValue.text,
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
          <Box width="50%" mr={2}>
            <TextField
              label="Check-in Date"
              variant="outlined"
              type="date"
              fullWidth
              margin="dense"
              size="medium"
              InputLabelProps={{
                shrink: true,
              }}
              name="checkInDate"
              onChange={handleInputChange}
              value={stay.checkInDate}
            />
          </Box>
          <Box width="50%" ml={2}>
            <TextField
              label="Check-out Date"
              variant="outlined"
              type="date"
              fullWidth
              margin="dense"
              size="medium"
              InputLabelProps={{ shrink: true }}
              name="checkOutDate"
              onChange={handleInputChange}
              value={stay.checkOutDate}
            />
          </Box>
        </Box>

        <Box display="flex" alignItems="center">
          <Box width="100%">
            <TextField
              label="Location"
              variant="outlined"
              fullWidth
              margin="dense"
              size="medium"
              name="location"
              onChange={handleInputChange}
              value={stay.location}
            />
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <Box width="100%">
            <TextField
              label="Notes"
              variant="outlined"
              multiline
              fullWidth
              margin="dense"
              size="medium"
              rows={3}
              name="notes"
              onChange={handleInputChange}
              value={stay.notes}
            />
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <Box width="100%"></Box>
        </Box>
      </Box>
      <Box mb={3} display="flex" pr={3} justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            addStay(stay);
            SetStay({
              tripId: tripId,
              hotel: '',
              checkInDate: '2021-04-01',
              checkOutDate: '2021-04-02',
              longitude: null,
              latitude: null,
              location: '',
              notes: '',
            });
          }}
        >
          ADD STAY
        </Button>
      </Box>
    </Container>
  );
};

export default AddStayPanel;
