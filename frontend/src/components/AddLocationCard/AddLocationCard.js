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
import { AppContext } from "../../AppContextProvider";
import axios from "axios";

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
		locationName: "",
		longitude: "",
		latitude: "",
	});
	const classes = useStyles();

	const { createTrips } = useContext(AppContext);

	//adding trip
	async function handleAdd() {
		// console.log("Do something!");
		// console.log(result);
		await createTrips({ result });
	}

	//adding new location
	const handleNewLocation = async (event) => {

		//please delete the following 

		const value = event.target.value
		console.log("the location is: " + value);
		setResult({
			...result,
			locationName: value
		});
		console.log(result);
		const longAndLat = await callApi(value);
		setResult({
			...result,
			locationName: value,
			longitude: longAndLat[0],
			latitude: longAndLat[1],
		});
		console.log(result);
	};

	//calling Geocoding api for long and lat location
	const callApi = async (location) => {
		const locationURL = encodeURIComponent(location);
		const accessToken =
			"pk.eyJ1IjoiY2hyaXNwYW5nZyIsImEiOiJja21jcjV2dXEwYWh2MnlteHF3cDJnaDRjIn0.9lg7qto5g9NlZ-SLg5NvEg";

		let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${locationURL}.json?limit=1&types=place&access_token=${accessToken}`;

		let longlat = null;
		try {
			const response = await axios.get(url);
			// console.log(response.data);
			longlat = [...response.data.features[0].center];
			console.log(longlat);
		} catch (error) {
			console.log(error.message);
		}
		return longlat;
	};

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
				<SearchField changed={handleNewLocation} />

				<DatePicker
					datelabel="start date"
					changed={(e) => setResult({ ...result, startDate: new Date(e) })}
					value={result.startDate}
				/>
				<DatePicker
					datelabel="end date"
					changed={(e) => setResult({ ...result, endDate: new Date(e) })}
					value={result.endDate}
				/>
			</CardContent>
			<CardActions>
				<Button size="large" color="primary" onClick={handleAdd}>
					Add Trip
				</Button>
			</CardActions>
		</Card>
	);
};

export default AddLocationCard;
