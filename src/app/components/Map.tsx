'use client'

import { useLoadScript, GoogleMap } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

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

    
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyCO0cmq-pEE39lV1ItHRM52pxYyETORlIo', // replace with your API key
    });


    const getLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setLocation({ lat: latitude, lng: longitude });
              if(zoom == undefined) setZoom(3);
            },
            (error) => {
              setLocation({lat : 46.151241, lng: 14.995463});
              setZoom(9);
            }
          );
        } else {
          alert("Geolocation is not supported by your browser.");
        }
    };
    
    if(zoom == undefined && location != undefined) setZoom(3);

    if(location == undefined)
      getLocation();
    else if (zoom == undefined) setZoom(3);

    if (!isLoaded) return <div>Loading...</div>;

    return (
    <GoogleMap
        mapContainerStyle={{
        width: '100vw',
        height: '100dvh',
        }}
        zoom={zoom}
        center={location}
    >
    </GoogleMap>
    );
}