import React from 'react';
import { Container, Button, Box, TextField } from '@material-ui/core';

const AddActivityPanel = () => {
  return (
    <Container maxWidth="md">
      <Box p={3} borderRadius={15}>
        <Box display="flex" alignItems="center">
          <Box width="100%">
            <TextField variant="outlined" fullWidth margin="dense" size="medium" label="Activity" />
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <Box width="50%" mr={2}>
            <TextField label="Start Date" variant="outlined" fullWidth margin="dense" size="medium" />
          </Box>
          <Box width="50%" ml={2}>
            <TextField label="End Date" variant="outlined" fullWidth margin="dense" size="medium" />
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <Box width="50%" mr={2}>
            <TextField label="Start Time" variant="outlined" fullWidth margin="dense" size="medium" />
          </Box>
          <Box width="50%" ml={2}>
            <TextField label="Finish Time" variant="outlined" fullWidth margin="dense" size="medium" />
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <Box width="100%">
            <TextField label="Location" variant="outlined" fullWidth margin="dense" size="medium" />
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <Box width="100%">
            <TextField multiline rows={4} label="Notes" variant="outlined" fullWidth margin="dense" size="medium" />
          </Box>
        </Box>
      </Box>
      <Box mb={3} display="flex" pr={3} justifyContent="flex-end">
        <Button variant="contained" color="primary">
          ADD ACTIVITY
        </Button>
      </Box>
    </Container>
  );
};

export default AddActivityPanel;
