import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { AppContext } from "../../AppContextProvider";
import { Button, Container, Box } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import SearchField from "../Mapbox/SearchField/SearchField";

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
	button: {
		width: 70,
		height: 27,
	},
});

export default function StaySummary() {
	const classes = useStyles();

	const { trips, isLoading, deleteTrips, updateTrips } = useContext(AppContext);

	const [tripId, setTripId] = useState(null);

	const [formValue, setFormValue] = useState({});

	const [open, setOpen] = React.useState(false);

	const [openWarning, setOpenWarning] = React.useState(false);

	const handleWarningClickOpen = (id) => {
		setOpenWarning(true);
		console.log(id);
		setTripId(id);
	};

	const handleWarningClose = () => {
		setOpenWarning(false);
	};

	const handleClickOpen = (trip) => {
		setOpen(true);
		setFormValue(trip);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setFormValue({ ...formValue, [name]: value });
	};

	const handleUpdate = () => {
		console.log(formValue);
		updateTrips(formValue);
		setOpen(false);
	};

	const handleDelete = () => {
		deleteTrips(tripId);
		setOpenWarning(false);
	};

	return (
		<div>
			<TableContainer component={Paper}>
				<Table className={classes.table} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell width="15%">Destination</TableCell>
							<TableCell align="center" width="10%">
								Start Date
							</TableCell>
							<TableCell align="center" width="10%">
								End Date
							</TableCell>
							<TableCell align="center" width="10%">
								{" "}
								Edit/ Delete{" "}
							</TableCell>
							<TableCell align="center" width="10%">
								{" "}
								View{" "}
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{trips.map((trip) => (
							<TableRow key={trip._id}>
								<TableCell component="th" scope="row">
									{trip.locationName}
								</TableCell>
								<TableCell align="center">
									{dayjs(trip.startDate).format("DD/MM/YYYY")}
								</TableCell>
								<TableCell align="center">
									{dayjs(trip.endDate).format("DD/MM/YYYY")}
								</TableCell>
								<TableCell align="center">
									<Box mb={1}>
										<Button
											size="small"
											classes={{ root: classes.button }}
											variant="contained"
											color="primary"
											onClick={() => {
												handleClickOpen(trip);
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
											onClick={() => handleWarningClickOpen(trip._id)}
										>
											DELETE
										</Button>
									</Box>
								</TableCell>
								<TableCell align="center">
									<Box>
										<Link
											style={{ textDecoration: "none", color: "white" }}
											to={"/tripdetails/" + trip._id}
											key={trip._id}
										>
											<Button
												size="small"
												classes={{ root: classes.button }}
												variant="outlined"
												color="primary"
											>
												View
											</Button>
										</Link>
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
				<DialogTitle id="form-dialog-title">Trip Details</DialogTitle>
				<DialogContent>
					<Container maxWidth="md">
						<Box p={3} borderRadius={15}>
							<Box display="flex" alignItems="center">
								<Box width="100%">
									<TextField
										label="Destination"
										variant="outlined"
										fullWidth
										margin="dense"
										size="medium"
										name="locationName"
										onChange={handleInputChange}
										value={formValue.locationName}
										disabled = "true"
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
										value={dayjs(formValue.startDate).format("YYYY-MM-DD")}
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
										value={dayjs(formValue.endDate).format("YYYY-MM-DD")}
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
				<DialogTitle id="alert-dialog-title">{"Warning"}</DialogTitle>
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
