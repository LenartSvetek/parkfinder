'use client'

import { useLoadScript, GoogleMap } from '@react-google-maps/api';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { generateData, parking} from '../data/data';
import ParkMarker from './ParkMarker';

import { mapStyle } from '../data/mapStyle';

export interface MapProps {
    center ?: {
      lat : number;
      lng : number;
    };
    vZoom ?: number;
    showElSpaces? : boolean;
    onMapClick ?: () => void
}

export interface MapHandle {
  getVisibleMarkers : () => parking[]
}

const Map = forwardRef<MapHandle, MapProps>(({...props}, ref) => {
    const [location, setLocation] = useState<{ lat: number; lng: number } | undefined>(props.center);
    const [zoom, setZoom] = useState<number | undefined>(props.vZoom);
    const [data, setData] = useState<parking[] | undefined>(undefined);

    const mapRef = useRef(null);
    
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

   
    if(location && data == undefined) setData(generateData(location));

    const getVisibleMarkers = () => {
      const bounds = mapRef.current.getBounds();
      const newVisibleMarkers = data.filter((marker) => {
        return bounds.contains(new window.google.maps.LatLng(marker.location.lat, marker.location.lng));
      });
      return newVisibleMarkers;
    };

    useImperativeHandle(ref, () => ({
      getVisibleMarkers
    }));

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
        onClick={props.onMapClick}
        onLoad={(map) => (mapRef.current = map)}
    >
      {
        data?.map((val : parking, i) => {
          return <ParkMarker key={i} location={val.location} level={val.level} parkInfo={val.parkInfo} showElSpaces={props.showElSpaces}></ParkMarker>
        })
      }
    </GoogleMap>
    );
});

Map.displayName = "Map";

export { Map };