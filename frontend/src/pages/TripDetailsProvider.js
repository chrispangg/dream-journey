import React, { useState, useEffect, useMemo } from 'react';
import useGet from '../hooks/useGet';
import axios from 'axios';
import { useRouteMatch } from 'react-router-dom';
import {useAuth0} from "@auth0/auth0-react";
import useAccessToken from "../hooks/useAccessToken";
import sendRequestWithAuth from "../libs/requestLib";


const TripDetailsContext = React.createContext({
  stays: [],
  activities: [],
  tripLongLat: [-70.9, 42.35],
  selectedLocation: null,
});

function TripDetailsContextProvider({ children }) {
  const match = useRouteMatch();
  const tripId = match.params.id;

  const { getAccessToken } = useAccessToken();

  // Set up the app to fetch stays from a REST API

  const { data: trip } = useGet(`/api/trips/${tripId}`, []);

  const tripLongLat = [trip.longitude, trip.latitude];

  const { data: stays, isLoading: isStaysLoading, refetch } = useGet(
    `/api/stays/${tripId}`,
    []
  );
  const {
    data: activities,
    isLoading: isActivitiesLoading,
    refetch: refetchActivities,
  } = useGet(`/api/activities/${tripId}`, []);

  const [selectedLocation, SetSelectedLocation] = useState(null);

  async function addStay(stay) {
    const token = await getAccessToken();
    await sendRequestWithAuth('POST', '/api/stays', stay, token)
    refetch();
  }

  async function deleteStay(stayId) {
    await axios.delete(`/api/stays/${stayId}`);
    refetch();
  }

  async function updateStay(stay) {
    await axios.put(`/api/stays/${stay._id}`, stay);
    refetch();
  }

  async function addActivity(activity) {
    await axios.post('/api/activities', activity);
    refetchActivities();
  }

  async function deleteActivity(activityId) {
    await axios.delete(`/api/activities/${activityId}`);
    refetchActivities();
  }

  async function updateActivity(activity) {
    await axios.put(`/api/activities/${activity._id}`, activity);
    refetchActivities();
  }

  // The context value that will be supplied to any descendants of this component.
  const context = {
    stays,
    isStaysLoading,
    addStay,
    deleteStay,
    updateStay,
    activities,
    isActivitiesLoading,
    addActivity,
    deleteActivity,
    updateActivity,
    tripId,
    tripLongLat,
    selectedLocation,
    SetSelectedLocation,
  };

  // Wraps the given child components in a Provider for the above context.
  return (
    <TripDetailsContext.Provider value={context}>
      {children}
    </TripDetailsContext.Provider>
  );
}

export { TripDetailsContext, TripDetailsContextProvider };
