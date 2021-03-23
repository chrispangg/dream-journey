import React from "react";
import styles from "./AddLocationCard.module.css";
import {
	makeStyles,
	Card,
	CardActions,
	CardContent,
	Button,
	Typography,
} from "@material-ui/core/";
import DatePicker from "../../util/DatePicker";
// import SearchField from "../Mapbox/SearchField/SearchField";

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
	const classes = useStyles();
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
