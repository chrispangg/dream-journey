import React, { useState, useEffect, useContext } from "react";
import styles from "./AddLocationCard.module.css";
import SearchField from "../Mapbox/SearchField/SearchField";
import {
	makeStyles,
	Card,
	CardActions,
	CardContent,
	Button,
	Typography,
} from "@material-ui/core/";
import DatePicker from "../../util/DatePicker";
import dayjs from "dayjs";
import { AppContext } from '../../AppContextProvider';

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
		startDate: dayjs(),
		endDate: dayjs().add(7, "day"),
		destination: "Auckland",
	});
	const classes = useStyles();

	const { trips, tripsLoading, createTrips, refetchTrips, updateTrips, deleteTrips } = useContext(AppContext);

	// useEffect(() => {
	// 	console.log(result);
	// 	//create a new object
	// 	//send results to server
	// 	const newTrip = {
	// 		//add something here
	// 	};
	// });

	async function handleAdd(){
		console.log("Do something!");
		console.log(result);
		await createTrips({ result });
	}

	return (
		<Card className={classes.root + " " + styles.card}>
			<CardContent>
				<Typography
					className={classes.title}
					color="textSecondary"
					gutterBottom
				>
					Add Trips
				</Typography>
				<Typography variant="p">Destination City</Typography>
				<SearchField
					changed={(e) => {setResult({ ...result, destination: e.target.value });}}
				/>

				<DatePicker
					datelabel="start date"
					changed={(e) => setResult({ ...result, startDate: new Date(e) })}
					value={result.startDate}
				/>
				<DatePicker
					datelabel="end date"
					changed={(e) => setResult({ ...result, endDate: new Date(e) })}
					value={result.startDate}
				/>
			</CardContent>
			<CardActions>
				<Button size="large" color="primary" onClick={ handleAdd }>
					Add Trip
				</Button>
			</CardActions>
		</Card>
	);
};

export default AddLocationCard;
