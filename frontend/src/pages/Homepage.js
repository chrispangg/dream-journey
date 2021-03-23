import React from "react";
import Mapbox from "../components/Mapbox/Map/Mapbox";
import AddLocationCard from "../components/AddLocationCard/AddLocationCard";

const Homepage = () => {
	return (
		<>
			<Mapbox />
			<AddLocationCard/>
		</>
	);
};

export default Homepage;
