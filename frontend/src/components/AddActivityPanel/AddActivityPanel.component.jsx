import React, { useState, useContext } from 'react';
import { Container, Button, Box, TextField } from '@material-ui/core';
import { TripDetailsContext } from '../../pages/TripDetailsProvider';

const AddActivityPanel = () => {
  const { addActivity, tripId } = useContext(TripDetailsContext);
  const [activity, SetActivity] = useState({
    tripId: tripId,
    activity: '',
    startDate: '2021-04-01',
    endDate: '2021-04-02',
    startTime: '07:30',
    finishTime: '08:30',
    location: '',
    notes: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    SetActivity({ ...activity, [name]: value });
    console.log(activity);
  };

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
            <TextField
              label="Location"
              variant="outlined"
              fullWidth
              margin="dense"
              size="medium"
              name="location"
              onChange={handleInputChange}
              value={activity.location}
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
          }}
        >
          ADD ACTIVITY
        </Button>
      </Box>
    </Container>
  );
};

export default AddActivityPanel;
