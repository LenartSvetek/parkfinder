'use client'

import { useLoadScript, GoogleMap } from '@react-google-maps/api';
import { useState } from 'react';
import { generateData, parking} from '../data/data';
import ParkMarker from './ParkMarker';

import { mapStyle } from '../data/mapStyle';

interface MapProps {
    center?: {
      lat: number;
      lng: number;
    };
    vZoom?: number;
  }
  

export default function Map({center, vZoom} : MapProps) {
    const [location, setLocation] = useState<{ lat: number; lng: number } | undefined>(center);
    const [zoom, setZoom] = useState<number | undefined>(vZoom);
    const [data, setData] = useState<parking[] | undefined>(undefined);

    
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyCO0cmq-pEE39lV1ItHRM52pxYyETORlIo', // replace with your API key
    });


    const getLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setLocation({ lat: latitude, lng: longitude });
              if(zoom == undefined) setZoom(19);
            },
            () => {
              setLocation({lat : 46.151241, lng: 14.995463});
              setZoom(9);
            }
          );
        }
    };
    
    if(zoom == undefined && location != undefined) setZoom(19);

    if(location == undefined)
      getLocation();
    else if (zoom == undefined) setZoom(19);

    if (!isLoaded) return <div>Loading...</div>;

   
    if(location && data == undefined) setData(generateData(location));


    return (
    <GoogleMap
        mapContainerStyle={{
        width: '100vw',
        height: '100dvh',
        }}
        zoom={zoom}
        center={location}
        options={{
          styles : mapStyle,
          disableDefaultUI: true, // Disables all default UI controls
          zoomControl: false,     // Disable zoom control
          streetViewControl: false, // Disable street view control
          mapTypeControl: false,  // Disable map type control
          fullscreenControl: false, // Disable fullscreen control
        }}
    >
      {
        data.map((val : parking, i) => {
          return <ParkMarker key={i} location={val.location} level={val.level} parkInfo={val.parkInfo}></ParkMarker>
        })
      }
    </GoogleMap>
    );
}