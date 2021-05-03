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
    await sendRequestWithAuth('POST', '/api/stays', stay, token);
    refetch();
  }

  async function deleteStay(stayId) {
    const token = await getAccessToken();
    await sendRequestWithAuth('DELETE', `/api/stays/${stayId}`, null, token);
    refetch();
  }

  async function updateStay(stay) {
    const token = await getAccessToken();
    await sendRequestWithAuth('PUT', `/api/stays/${stay._id}`, stay, token);
    refetch();
  }

  async function addActivity(activity) {
    const token = await getAccessToken();
    await sendRequestWithAuth('POST', '/api/activities', activity, token);
    refetchActivities();
  }

  async function deleteActivity(activityId) {
    const token = await getAccessToken();
    await sendRequestWithAuth('DELETE', `/api/activities/${activityId}`, null, token);
    refetchActivities();
  }

  async function updateActivity(activity) {
    const token = await getAccessToken();
    await sendRequestWithAuth('PUT', `/api/activities/${activity._id}`, activity, token);
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
