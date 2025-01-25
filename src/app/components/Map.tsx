'use client'

import { GoogleMap, Marker } from '@react-google-maps/api';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { generateData, parking} from '../data/data';
import { ParkMarker } from './ParkMarker';

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
    const [currentLocation, setCurrentLocation] = useState<{ lat: number, lng : number} | undefined>(undefined);
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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition((position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        }
      )
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        () => {
          setCurrentLocation({lat : 46.151241, lng: 14.995463});
        }
      );
    }
};

    const getVisibleMarkers = () => {
      if(map == undefined) return [];

      const bounds = map.getBounds();
      if(bounds == undefined) return [];
      return data.filter((marker) => {
        return bounds.contains(new window.google.maps.LatLng(marker.location.lat, marker.location.lng));
      });
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


    if(location && data.length == 0) setData(generateData());

    useEffect(()=> {
      if(currentLocation == undefined)
        getCurrentLocation();
    }, [])

    const customSvgIcon : google.maps.Icon = {
      url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="white" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256-96a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/></svg>',
      scaledSize: new google.maps.Size(20, 20), // Scale the size of the
      anchor: new google.maps.Point(10, 10)

    };

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
        currentLocation? <Marker position={currentLocation} icon={customSvgIcon}></Marker> : <></>
      }
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