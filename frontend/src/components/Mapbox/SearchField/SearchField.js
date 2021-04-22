import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import axios from "axios";

const SearchField = (props) => {
	mapboxgl.accessToken = process.env.REACT_APP_MAPBOX;

	async function handleAdd(e) {

		const locationURI = encodeURIComponent(e.target.value);
		let requestURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${locationURI}.json?types=place,region&access_token=${mapboxgl.accessToken}`;

		const callApi = async () => {
			let result = null;

			try {
				const response = await axios.get(requestURL);
				const responseJSON = response.data;
				const responseFeatures = responseJSON.features;

				result = {
					destination: e.target.value,
					longitude: responseFeatures[0].geometry.coordinates[0],
					latitude: responseFeatures[0].geometry.coordinates[1],
				
				};
			} catch (error) {
				console.log(error.message);
			}
			return result;
		};
		
		let resultValues = await callApi();
		console.log();

		props.changed(resultValues);
	}

	useEffect(() => {
		let types = props.types;
		if (types === null) {
			types = "region, places";
		}
		const geocoder = new MapboxGeocoder({
			accessToken: mapboxgl.accessToken,
			placeholder: props.placeholder,
			// types: "country, region, postcode, district, place, locality, neighborhood, address",
			types: types,
			mode: "mapbox.places",
		});

		geocoder.addTo("#geocoder");
	}, []);

	return (
		<>
			{/* <div id="geocoder" onBlur={props.changed} ></div> */}
			<div
				id="geocoder"
				onBlur={async (e) => {
					await handleAdd(e);
				}}
			></div>
		</>
	);
};

export default SearchField;
