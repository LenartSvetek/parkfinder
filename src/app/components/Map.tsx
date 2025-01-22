'use client'

import { useLoadScript, GoogleMap } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

interface MapProps {
    center?: {
      lat: number;
      lng: number;
    };
    zoom: number;
  }
  

export default function Map({center, zoom} : MapProps) {
    const [location, setLocation] = useState<{ lat: number; lng: number } | undefined>(center);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyCO0cmq-pEE39lV1ItHRM52pxYyETORlIo', // replace with your API key
    });


    const getLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setLocation({ lat: latitude, lng: longitude });
            },
            (error) => {
              console.error("Error fetching geolocation:", error);
              alert("Unable to retrieve your location");
            }
          );
        } else {
          alert("Geolocation is not supported by your browser.");
        }
    };
    
    useEffect(() => {
        if(location == undefined)
            getLocation();
    }, []);

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