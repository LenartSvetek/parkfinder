'use client'

import { GoogleMap } from '@react-google-maps/api';
import { forwardRef, RefObject, useImperativeHandle, useRef, useState } from 'react';
import { generateData, parking} from '../data/data';
import { ParkMarker, ParkMarkerHandle } from './ParkMarker';

import { mapStyle } from '../data/mapStyle';

export interface MapProps {
    center ?: {
      lat : number;
      lng : number;
    };
    vZoom ?: number;
    showElSpaces? : boolean;
    onMapClick ?: () => void;
    onMarkerClick ?: (idParking : number) => void
}

export interface MapHandle {
  getVisibleMarkers : () => parking[],
  goTo : (location : google.maps.LatLng) => void,
  zoomTo : (zoomLevel : number) => void,
  getData : () => parking[]
}

const Map = forwardRef<MapHandle, MapProps>(({...props}, ref) => {
    const [location, setLocation] = useState<{ lat: number; lng: number } | undefined>(props.center);
    const [zoom, setZoom] = useState<number | undefined>(props.vZoom);
    const [data, setData] = useState<parking[]>([]);
    const [map, setMap] = useState<google.maps.Map | undefined>(undefined);

    
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

    const getVisibleMarkers = () => {
      if(map == undefined) return [];

      const bounds = map.getBounds();
      if(bounds == undefined) return [];
      const newVisibleMarkers = data.filter((marker) => {
        return bounds.contains(new window.google.maps.LatLng(marker.location.lat, marker.location.lng));
      });
      return newVisibleMarkers;
    };

    const goTo = (location : google.maps.LatLng) => {
      if(map == undefined) return;

      map.panTo(location);
    }

    const zoomTo = (zoomLevel : number) => {
      if(map == undefined) return;

      map.setZoom(zoomLevel);
    }

    const getData = () => data;

    useImperativeHandle(ref, () => ({
      getVisibleMarkers,
      goTo,
      zoomTo,
      getData
    }));

    if(zoom == undefined && location != undefined) setZoom(19);

    if(location == undefined)
      getLocation();
    else if (zoom == undefined) setZoom(17);

  
    if(location && data.length == 0) setData(generateData(location));

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
        onLoad={setMap}
    >
      {
        data?.map((val : parking, i) => {
          return <ParkMarker onMarkerClick={props.onMarkerClick} key={i} location={val.location} level={val.level} parkInfo={val.parkInfo} showElSpaces={props.showElSpaces} name={val.name} idParking={val.idParking}></ParkMarker>
        })
      }
    </GoogleMap>
    );
});

Map.displayName = "Map";

export { Map };