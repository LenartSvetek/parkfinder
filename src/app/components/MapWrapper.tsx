'use client'

import {Map, MapHandle, MapProps } from "./Map";
import { forwardRef } from "react";



const MapWrapper = forwardRef<MapHandle, MapProps>((props : MapProps, ref) => {
  /*const libraries : Libraries = ["places"]
    const { isLoaded } = useLoadScript({
      googleMapsApiKey: 'AIzaSyCO0cmq-pEE39lV1ItHRM52pxYyETORlIo',
      libraries: libraries
    });
   
    

    if (!isLoaded) {
      return <div>Loading Google Maps...</div>;
    }
  */
    return <Map {...props} ref={ref}/>;
});

MapWrapper.displayName = "MapWrapper";

export { MapWrapper };