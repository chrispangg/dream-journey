import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Container } from '@material-ui/core';
import { StyledMap, useStyles } from './ActivitiesMap.styles';
import 'mapbox-gl/dist/mapbox-gl.css';

const ActivitiesMap = () => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiY2hyaXNwYW5nZyIsImEiOiJja21jcjV2dXEwYWh2MnlteHF3cDJnaDRjIn0.9lg7qto5g9NlZ-SLg5NvEg';
  const classes = useStyles();
  const mapContainer = useRef(null);
  const geocoderContainer = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [lng, lat],
      zoom: zoom,
    });
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    });
    // map.addControl(geocoder);
    geocoder.onAdd(map);
    geocoder.addTo(geocoderContainer.current);
    return () => map.remove();
  }, []);
  return (
    <Container maxWidth="lg" className={classes.root}>
      <StyledMap className="map-container" ref={mapContainer} />
      <div ref={geocoderContainer}></div>
    </Container>
  );
};

export default ActivitiesMap;
