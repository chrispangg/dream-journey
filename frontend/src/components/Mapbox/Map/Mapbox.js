import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import classes from "./Mapbox.module.css";

const Mapbox = () => {
	const [lng, setLng] = useState(-70.9);
	const [lat, setLat] = useState(42.35);
	const [zoom, setZoom] = useState(9);
	const [markers, setMarkets] = useState([
		{ id: 1, longlat: [-36.8509, 80.7645] },
		{ id: 2, longlat: [-41.2924, 30.7787] },
	]);

	//API token
	mapboxgl.accessToken =
		"pk.eyJ1IjoiY2hyaXNwYW5nZyIsImEiOiJja21jcjV2dXEwYWh2MnlteHF3cDJnaDRjIn0.9lg7qto5g9NlZ-SLg5NvEg";

	useEffect(() => {
		//generates map
		const map = new mapboxgl.Map({
			container: "mapContainer",
			style: "mapbox://styles/mapbox/streets-v11",
			center: [lng, lat],
			zoom: zoom,
		});
		//add nav control to map
		const nav = new mapboxgl.NavigationControl();

		map.addControl(nav, "top-right");

		//generate markers
		markers.map((marker) =>
			new mapboxgl.Marker().setLngLat(marker.longlat).addTo(map)
		);

		//find geo location of user
		const geolocate = new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true,
			},
			trackUserLocation: true,
		});
		//add geolocation control to map
		map.addControl(geolocate, "top-right");

		return () => map.remove();
	}, [lat, lng, zoom, markers]);

	return (
		<div className="mapdiv">
			<div id="mapContainer" className={classes.map}></div>
		</div>
	);
};

export default Mapbox;
