import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const SearchField = (props) => {
	mapboxgl.accessToken = "pk.eyJ1IjoiY2hyaXNwYW5nZyIsImEiOiJja21jcjV2dXEwYWh2MnlteHF3cDJnaDRjIn0.9lg7qto5g9NlZ-SLg5NvEg";

	useEffect(() => {
		const geocoder = new MapboxGeocoder({
			accessToken: mapboxgl.accessToken,
			types: "country, region, postcode, district, place, locality, neighborhood, address",
		});
	
		console.log("Coordinate is: " + geocoder.getProximity);
		geocoder.addTo("#geocoder");
	}, [props]);

	return (
		<>
			<div id="geocoder" onBlur={ props.changed }></div>
		</>
	);
};

export default SearchField;