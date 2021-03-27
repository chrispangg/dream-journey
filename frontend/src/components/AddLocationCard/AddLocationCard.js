import React, { useState, useEffect } from "react";
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
	const [result, setResult] = useState("");
	const classes = useStyles();

	useEffect(() => {
		console.log(result);
	});

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
				<SearchField changed={(e) => setResult(e.target.value)} />

				<DatePicker datelabel="start date" />
				<DatePicker datelabel="end date" />
			</CardContent>
			<CardActions>
				<Button size="large" color="primary">
					Add Trip
				</Button>
			</CardActions>
		</Card>
	);
};

export default AddLocationCard;
