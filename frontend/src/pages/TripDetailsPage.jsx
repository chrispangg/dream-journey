import React from 'react';
import ActivitiesMap from '../components/ActivitiesMap/ActivitiesMap.component';
import CombinedPanel from '../components/CombinedPanel/CombinePanel.component';
import CombinedSummary from '../components/CombinedSummary/CombinedSummary.component';
import { TripDetailsContextProvider } from './TripDetailsProvider';

const TripDetailsPage = () => {
  return (
    <div style={{ height: 2000 }}>
      <TripDetailsContextProvider>
        <ActivitiesMap />
        <CombinedPanel />
        <CombinedSummary />
      </TripDetailsContextProvider>
    </div>
  );
};

export default TripDetailsPage;
