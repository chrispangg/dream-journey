import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';


const SearchField = (props) => {
	mapboxgl.accessToken =
		"pk.eyJ1IjoiY2hyaXNwYW5nZyIsImEiOiJja21jcjV2dXEwYWh2MnlteHF3cDJnaDRjIn0.9lg7qto5g9NlZ-SLg5NvEg";

	useEffect(() => {
		const geocoder = new MapboxGeocoder({
			accessToken: mapboxgl.accessToken,
			types: "country,region,place,postcode,locality,neighborhood",
		});

		geocoder.addTo("#geocoder");
	});

	return <div id="geocoder"></div>;
};

export default SearchField;
