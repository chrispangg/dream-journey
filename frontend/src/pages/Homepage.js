import React from "react";
import Mapbox from "../components/Mapbox/Map/Mapbox";
import AddLocationCard from "../components/AddLocationCard/AddLocationCard";
import TripListCard from "../components/TripListCard/TripListCard";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
	root: {
		width: "100%",
		maxWidth: 500,
	},
});

const Homepage = () => {
	return (
		<>
			<Mapbox />
			<AddLocationCard />
			<TripListCard />
		</>
	);
};

export default Homepage;
