import React, { useState, useContext } from 'react';
import { Container, Button, Box, TextField } from '@material-ui/core';
import { TripDetailsContext } from '../../pages/TripDetailsProvider';

const AddStayPanel = () => {
  const [stay, SetStay] = useState({
    hotel: '',
    checkInDate: '2021-04-01',
    checkOutDate: '2021-04-02',
    location: '',
    notes: '',
  });

  const { addStay } = useContext(TripDetailsContext);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    SetStay({ ...stay, [name]: value });
  };
  return (
    <Container maxWidth="md">
      <Box p={3} borderRadius={15}>
        <Box display="flex" alignItems="center">
          <Box width="100%">
            <TextField
              label="Hotel"
              variant="outlined"
              fullWidth
              margin="dense"
              size="medium"
              name="hotel"
              onInput={handleInputChange}
              value={stay.hotel}
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
      </Box>
      <Box mb={3} display="flex" pr={3} justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            addStay(stay);
          }}
        >
          ADD STAY
        </Button>
      </Box>
    </Container>
  );
};

export default AddStayPanel;
