import React, { useState, useEffect, useContext } from "react";
import styles from "./AddLocationCard.module.css";
import SearchField from "../Mapbox/SearchField/SearchField";
import {
	makeStyles,
	Paper,
	CardActions,
	Box,
	Button,
	Typography,
} from "@material-ui/core/";
import DatePicker from "../../util/DatePicker";
import dayjs from "dayjs";
import { AppContext } from "../../AppContextProvider";
import axios from "axios";
import MUISearch from "../MUISearch/MUISearch.component";

const useStyles = makeStyles({
	root: {
		minWidth: 50,
	},
	bullet: {
		display: "inline-block",
		margin: "0 2px",
		transform: "scale(0.8)",
	},
	title: {
		fontSize: 30,
	},
	pos: {
		marginBottom: 12,
	},
});

const AddLocationCard = () => {
	const [result, setResult] = useState({
		destination: "Boston",
		longitude: -70.9,
		latitude: 42.35,
		startDate: dayjs(),
		endDate: dayjs().add(7, "day"),
		completed: false,
	});
	const classes = useStyles();

	const { createTrips } = useContext(AppContext);

	async function handleAdd() {
		console.log("This is what we are adding: " + result);
		setResult({ ...result, completed: true });
	}

	useEffect(() => {
		console.log(result);
		if (result.completed) {
			createTrips({ result });
			setResult({ ...result, completed: false });
		}
	}, [result]);

	return (
		<Paper elevation={3} className={classes.root + " " + styles.card}>
			<Box p={3} borderRadius={10}>
				<Typography
					className={classes.title}
					color="textSecondary"
					gutterBottom
				>
					Add Trips
				</Typography>
				<Box display="flex" alignItems="center">
					<Box>
						<MUISearch
							changed={(e) => {
								setResult({
									...result,
									destination: e.place_name,
									longitude: e.geometry.coordinates[0],
									latitude: e.geometry.coordinates[1],
								});
							}}
							types="region,place"
						/>
					</Box>
					<Box width="50%">
						<DatePicker
							datelabel="start-date"
							changed={(e) => {
								let today = new Date(e);
								let tomorrow = new Date(e);
								tomorrow.setDate(today.getDate() + 7);
								setResult({ ...result, startDate: today, endDate: tomorrow });
								console.log("Date: " + result.startDate);
								console.log("Location: " + result.destination);
							}}
							value={result.startDate}
						/>
					</Box>
					<Box width="50%">
						<DatePicker
							datelabel="end-date"
							changed={(e) => setResult({ ...result, endDate: new Date(e) })}
							value={result.endDate}
						/>
					</Box>
				</Box>
				<Box mt={3} display="flex" pr={3} justifyContent="flex-end">
					<Button
						size="large"
						color="primary"
						variant="contained"
						onClick={handleAdd}
					>
						Add Trip
					</Button>
				</Box>
			</Box>
		</Paper>
	);
};

export default AddLocationCard;
