import React from "react";
import Mapbox from "../components/Mapbox/Map/Mapbox";
import AddLocationCard from "../components/AddLocationCard/AddLocationCard";
import TripListCard from '../components/TripListCard/TripListCard';

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
