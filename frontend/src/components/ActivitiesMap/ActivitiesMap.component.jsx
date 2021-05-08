import React, { useRef, useEffect, useState, useContext, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Container } from '@material-ui/core';
import { StyledMap, useStyles } from './ActivitiesMap.styles';
import 'mapbox-gl/dist/mapbox-gl.css';
import { TripDetailsContext } from '../../pages/TripDetailsProvider';

const ActivitiesMap = () => {
  let { tripLongLat, stays, activities, selectedLocation } = useContext(
    TripDetailsContext
  );
  mapboxgl.accessToken =
    'pk.eyJ1IjoiY2hyaXNwYW5nZyIsImEiOiJja21jcjV2dXEwYWh2MnlteHF3cDJnaDRjIn0.9lg7qto5g9NlZ-SLg5NvEg';
  const classes = useStyles();
  const mapContainer = useRef(null);
  const geocoderContainer = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(10);
  const [tripLocation, setTripLocation] = useState(true);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [lng, lat],
      zoom: zoom,
    });
   

    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });
    // console.log(zoom);
    if (
      tripLocation &&
      tripLongLat[0] !== undefined &&
      tripLongLat[1] !== undefined
    ) {
      setLng(tripLongLat[0]);
      setLat(tripLongLat[1]);
      setTripLocation(false);
    }

    stays.map((stay) => {
      let longlat = [stay.longitude, stay.latitude];
      let newMarker = new mapboxgl.Marker({ color: '#119415' }).setLngLat(
        longlat
      );
      newMarker.addTo(map);
    });

    activities.map((activity) => {
      let longlat = [activity.longitude, activity.latitude];
      let newMarker = new mapboxgl.Marker({ color: '#112094' }).setLngLat(
        longlat
      );
      newMarker.addTo(map);
    });

    if (selectedLocation !== null) {
      map.flyTo({
        center: [selectedLocation[0], selectedLocation[1]],
        speed: 9,
        curve: 1,
        zoom: 16,
        easing(t) {
          return t;
        },
      });
      let longlat = [selectedLocation[0], selectedLocation[1]];
      let tempMarker = new mapboxgl.Marker({ color: '#ff0000' }).setLngLat(
        longlat
      );
      tempMarker.addTo(map);
    }

    return () => map.remove();
  }, [tripLongLat, stays, selectedLocation]);

  return (
    <Container maxWidth="lg" className={classes.root}>
      <StyledMap className="map-container" ref={mapContainer} />
      <div ref={geocoderContainer}></div>
    </Container>
  );
};

export default ActivitiesMap;
