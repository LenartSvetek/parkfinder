'use client'

import { GoogleMap } from '@react-google-maps/api';
import { forwardRef, RefObject, useImperativeHandle, useRef, useState } from 'react';
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
    onMapClick ?: () => void;
    searchRef : RefObject<HTMLInputElement | null>;
}

export interface MapHandle {
  getVisibleMarkers : () => parking[],
  getLatLngFromLocation : () => {lat : number, lng : number} | undefined
}

const Map = forwardRef<MapHandle, MapProps>(({...props}, ref) => {
    const [location, setLocation] = useState<{ lat: number; lng: number } | undefined>(props.center);
    const [zoom, setZoom] = useState<number | undefined>(props.vZoom);
    const [data, setData] = useState<parking[]>([]);
    const [autocomplete, setAutocomple] = useState<google.maps.places.Autocomplete | undefined>(undefined);

    const mapRef = useRef<google.maps.Map>(null);
    
    const getLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setLocation({ lat: latitude, lng: longitude });
              if(zoom == undefined) setZoom(17);
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
    else if (zoom == undefined) setZoom(17);

   
    if(location && data.length == 0) setData(generateData(location));

    const getVisibleMarkers = () => {
      if(mapRef.current == null) return [];

      const bounds = mapRef.current.getBounds();
      if(bounds == undefined) return [];
      const newVisibleMarkers = data.filter((marker) => {
        return bounds.contains(new window.google.maps.LatLng(marker.location.lat, marker.location.lng));
      });
      return newVisibleMarkers;
    };

    const getLatLngFromLocation = () => {
      if(autocomplete == undefined) return;
      
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const latlng = place.geometry.location;
        if(latlng == undefined) return;

        console.log('City:', place.name);
        console.log('Latitude:', latlng.lat());
        console.log('Longitude:', latlng.lng());
      } else {
        console.error('No geometry found for the selected place.');
      }

      return {lat: 1, lng: 1};
    }

    useImperativeHandle(ref, () => ({
      getVisibleMarkers,
      getLatLngFromLocation
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
        onLoad={(map) => {
          (mapRef.current = map);
          if(props.searchRef.current == null) return;
          setAutocomple(new window.google.maps.places.Autocomplete(props.searchRef.current));
        }}
    >
      {
        data?.map((val : parking, i) => {
          return <ParkMarker key={i} location={val.location} level={val.level} parkInfo={val.parkInfo} showElSpaces={props.showElSpaces} name={val.name}></ParkMarker>
        })
      }
    </GoogleMap>
    );
});

Map.displayName = "Map";

export { Map };