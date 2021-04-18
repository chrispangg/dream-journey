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
		destination: "Boston",
		longitude: -70.9,
		latitude: 42.35,
		startDate: dayjs(),
		endDate: dayjs().add(7, "day"),
		completed: false,
	});
	const classes = useStyles();

	const {
		createTrips,
	} = useContext(AppContext);
	const mapboxAccessToken =
		"pk.eyJ1IjoiY2hyaXNwYW5nZyIsImEiOiJja21jcjV2dXEwYWh2MnlteHF3cDJnaDRjIn0.9lg7qto5g9NlZ-SLg5NvEg";

	// function handleFetchCoordinator(){
	// 	console.log("Destination: " + result.destination);

	// 	const locationURI = encodeURIComponent(result.destination);
	// 	let requestURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${locationURI}.json?types=place&access_token=${mapboxAccessToken}`;

	// 	const callApi = async () => {
	// 		try {
	// 			const response = await axios.get(requestURL);
	// 			const responseJSON = response.data;
	// 			const responseFeatures = responseJSON.features;
	// 			console.log("The name of location is: " + responseFeatures[1].place_name);
	// 			console.log("The longitude is: " + responseFeatures[1].geometry.coordinates[0]);
	// 			console.log("The latitude is: " + responseFeatures[1].geometry.coordinates[1]);
	// 			setResult({ ...result, longitude: responseFeatures[1].geometry.coordinates[0], latitude: responseFeatures[1].geometry.coordinates[1] });
	// 		} catch(error) {
	// 			console.log(error.message);
	// 		}
	// 	}
	// 	callApi();
	// }

	async function handleAdd() {
		console.log("Destination: " + result.destination);

		const locationURI = encodeURIComponent(result.destination);
		let requestURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${locationURI}.json?types=place,region&access_token=${mapboxAccessToken}`;

		const callApi = async () => {
			try {
				const response = await axios.get(requestURL);
				const responseJSON = response.data;
				const responseFeatures = responseJSON.features;
				console.log(
					"The name of location is: " + responseFeatures[0].place_name
				);
				console.log(
					"The longitude is: " + responseFeatures[0].geometry.coordinates[0]
				);
				console.log(
					"The latitude is: " + responseFeatures[0].geometry.coordinates[1]
				);
				setResult({
					...result,
					longitude: responseFeatures[0].geometry.coordinates[0],
					latitude: responseFeatures[0].geometry.coordinates[1],
					completed: true
				});
			} catch (error) {
				console.log(error.message);
			}
			
		};
		callApi();

		
	}

	useEffect(()=>{
		console.log(result);
		if(result.completed){
			createTrips({ result });
			setResult({...result, completed: false});
		}
		
	},[result])


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
					changed={(e) => {
						setResult({ ...result, destination: e.target.value });
					}}
				/>

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

				<DatePicker
					datelabel="end-date"
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
