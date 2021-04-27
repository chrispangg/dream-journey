import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { TripDetailsContext } from '../../pages/TripDetailsProvider';
import { Button, Container, Box } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import dayjs from 'dayjs';
import mapboxgl from 'mapbox-gl';
import throttle from 'lodash/throttle';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  button: {
    width: 70,
    height: 27,
  },
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}));

export default function StaySummary() {
  const classes = useStyles();

  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX;

  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);

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

  const {
    stays,
    isStaysLoading,
    deleteStay,
    updateStay,
    tripLongLat,
    SetSelectedLocation,
  } = useContext(TripDetailsContext);

  const [stayId, setStayId] = useState(null);

  const [formValue, setFormValue] = useState({});

  const [open, setOpen] = React.useState(false);

  const [openWarning, setOpenWarning] = React.useState(false);

  const handleWarningClickOpen = (id) => {
    setOpenWarning(true);
    setStayId(id);
  };

  const handleWarningClose = () => {
    setOpenWarning(false);
  };

  const handleClickOpen = (stay) => {
    setOpen(true);
    setFormValue(stay);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValue({ ...formValue, [name]: value });
  };

  const handleUpdate = () => {
    updateStay(formValue);
    setOpen(false);
  };

  const handleDelete = () => {
    deleteStay(stayId);
    setOpenWarning(false);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell width="15%">Hotel</TableCell>
              <TableCell align="center" width="10%">
                Check-in Date
              </TableCell>
              <TableCell align="center" width="10%">
                Check-out Date
              </TableCell>
              <TableCell align="center" width="20%">
                Address
              </TableCell>
              <TableCell align="center">Notes</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stays.map((stay) => (
              <TableRow key={stay._id}>
                <TableCell component="th" scope="row">
                  {stay.hotel}
                </TableCell>
                <TableCell align="center">
                  {dayjs(stay.checkInDate).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell align="center">
                  {dayjs(stay.checkOutDate).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell align="left">{stay.location}</TableCell>
                <TableCell align="left">{stay.notes}</TableCell>
                <TableCell>
                  <Box mb={1}>
                    <Button
                      size="small"
                      classes={{ root: classes.button }}
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        handleClickOpen(stay);
                      }}
                    >
                      EDIT
                    </Button>
                  </Box>
                  <Box>
                    <Button
                      size="small"
                      classes={{ root: classes.button }}
                      variant="contained"
                      color="secondary"
                      onClick={() => handleWarningClickOpen(stay._id)}
                    >
                      DELETE
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Stay Details</DialogTitle>
        <DialogContent>
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
                        setFormValue({
                          ...formValue,
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
                    value={dayjs(formValue.checkInDate).format('YYYY-MM-DD')}
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
                    value={dayjs(formValue.checkOutDate).format('YYYY-MM-DD')}
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
                    value={formValue.location}
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
                    value={formValue.notes}
                  />
                </Box>
              </Box>
            </Box>
          </Container>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdate} color="primary">
            UPDATE
          </Button>
          <Button onClick={handleClose} color="primary">
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openWarning}
        onClose={handleWarningClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Warning'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this entry?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleWarningClose} color="primary">
            CANCEL
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            DELETE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
