import React, { useEffect, useState, useContext} from "react";
import mapboxgl from "mapbox-gl";
import classes from "./Mapbox.module.css";
import { AppContext } from '../../../AppContextProvider';

const Mapbox = () => {
	const [lng] = useState(40.7305417121548);
	const [lat] = useState(34.46896138009291);
	const [zoom] = useState(0.5);

	const { trips } = useContext(AppContext);


	//API token
	mapboxgl.accessToken = process.env.REACT_APP_MAPBOX;

	useEffect(() => {
		const center = () =>{
			// let option1 = [trips[0].longitude, trips[0].latitude];
			let option1 = [lng, lat];
			// console.log(option1);
			if (option1 === null) {
				option1 = [lng, lat];
			}
			return option1;
		}

		//generates map
		const map = new mapboxgl.Map({
			container: "mapContainer",
			style: "mapbox://styles/mapbox/streets-v11",
			// center: center(),
			center: center(),
			zoom: zoom,
		});
		//add nav control to map
		const nav = new mapboxgl.NavigationControl();

		map.addControl(nav, "top-right");

		//generate markers
		trips.map((trip) => {
			let longlat = [trip.longitude, trip.latitude];
			let newMarker = new mapboxgl.Marker().setLngLat(longlat);
			newMarker.addTo(map);
			// console.log("The coordinator is: " + newMarker.getLngLat().lng + ", " + newMarker.getLngLat().lat);
		});

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
	}, [lat, lng, zoom, trips]);

	return <div id="mapContainer" className={ classes.map }></div>;
};

export default Mapbox;