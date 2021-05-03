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
import dayjs from 'dayjs';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  button: {
    width: 70,
    height: 27,
  },
});

export default function ActivitiesSummary() {
  const classes = useStyles();

  const {
    activities,
    isActivitiesLoading,
    deleteActivity,
    updateActivity,
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

  const handleClickOpen = (activity) => {
    setOpen(true);
    setFormValue(activity);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValue({ ...formValue, [name]: value });
  };

  const handleUpdate = () => {
    updateActivity(formValue);
    setOpen(false);
  };

  const handleDelete = () => {
    deleteActivity(stayId);
    setOpenWarning(false);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell width="15%">Activity</TableCell>
              <TableCell align="center" width="10%">
                Start Date
              </TableCell>
              <TableCell align="center" width="10%">
                End Date
              </TableCell>
              <TableCell align="center" width="10%">
                Start Time
              </TableCell>
              <TableCell align="center" width="10%">
                Finish Time
              </TableCell>
              <TableCell align="center" width="20%">
                Address
              </TableCell>
              <TableCell align="center">Notes</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity._id}>
                <TableCell component="th" scope="row">
                  {activity.activity}
                </TableCell>
                <TableCell align="center">
                  {dayjs(activity.startDate).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell align="center">
                  {dayjs(activity.endDate).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell align="center">{activity.startTime}</TableCell>
                <TableCell align="center">{activity.finishTime}</TableCell>
                <TableCell align="left">{activity.location}</TableCell>
                <TableCell align="left">{activity.notes}</TableCell>
                <TableCell>
                  <Box mb={1}>
                    <Button
                      size="small"
                      classes={{ root: classes.button }}
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        handleClickOpen(activity);
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
                      onClick={() => handleWarningClickOpen(activity._id)}
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
        <DialogTitle id="form-dialog-title">Activity Details</DialogTitle>
        <DialogContent>
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
                    value={formValue.activity}
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
                    value={dayjs(formValue.startDate).format('YYYY-MM-DD')}
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
                    InputLabelProps={{ shrink: true }}
                    name="endDate"
                    onChange={handleInputChange}
                    value={dayjs(formValue.endDate).format('YYYY-MM-DD')}
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
                    value={formValue.startTime}
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
                    value={formValue.finishTime}
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
