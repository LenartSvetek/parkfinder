'use client'

import { GoogleMap, Marker } from '@react-google-maps/api';
import { forwardRef, SetStateAction, useEffect, useImperativeHandle, useState } from 'react';
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
  getCloseParkings : () => parking[],
  goTo : (location : google.maps.LatLng) => void,
  zoomTo : (zoomLevel : number) => void,
  goAndZoom : (location : google.maps.LatLng, zoomLevel : number) => void,
  getData : () => parking[],
  setData : (data : SetStateAction<parking[]>) => void
  goToUser : () => void
}

const haversineDistance = (lat1 : number, lon1 : number, lat2 : number, lon2 : number) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

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

    const getCloseParkings = () => {
      if(map == undefined && currentLocation == undefined) return [];

      return data.filter((marker) => {
        if(currentLocation == undefined) return false;
        return haversineDistance(currentLocation?.lat, currentLocation?.lng, marker.location.lat, marker.location.lng) < 4;
      });
    }

    const goTo = (location : google.maps.LatLng) => {
      if(map == undefined) return;

      map.panTo(location);
    }

    const zoomTo = (zoomLevel : number) => {
      if(map == undefined) return;

      map.setZoom(zoomLevel);
    }

    const goAndZoom = (location : google.maps.LatLng, zoomLevel : number) => {
      if(map == undefined) return;

      map.setZoom(zoomLevel);
      map.panTo(location);
      

    }

    const getData = () => data;

    const goToUser = () => {
      if(map && currentLocation) map.panTo(currentLocation);
    }

    useImperativeHandle(ref, () => ({
      getVisibleMarkers,
      getCloseParkings,
      goTo,
      zoomTo,
      goAndZoom,
      getData,
      setData,
      goToUser
    }));

    if(zoom == undefined && location != undefined) setZoom(19);

    if(location == undefined)
      getLocation();
    else if (zoom == undefined) setZoom(17);


    if(location && data.length == 0) setData(generateData(location));

    useEffect(()=> {
      if(currentLocation == undefined)
        getCurrentLocation();
    }, [])

    const customSvgIcon : google.maps.Icon = {
      url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="white" d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256-96a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/></svg>',
      scaledSize: new google.maps.Size(20, 20), // Scale the size of the
      anchor: new google.maps.Point(10, 10)

    };

    const handleMapClick = () => {
      if(props.onMapClick)
        props.onMapClick();
    }

    /*const handleRightClick = (e : google.maps.MapMouseEvent) => {
        if(e.latLng)
          setCurrentLocation({lat: e.latLng.lat(), lng: e.latLng.lng()});
    }*/

    const onMapLoad = (ref : google.maps.Map) => {
      setMap(ref);

      //ref.addListener("rightclick", handleRightClick);
    }

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
        onClick={handleMapClick}
        onLoad={onMapLoad}
    >
      {
        currentLocation? <Marker position={currentLocation} icon={customSvgIcon}></Marker> : <></>
      }
      {
        data?.map((val : parking, i) => {
          return <ParkMarker onMarkerClick={props.onMarkerClick} key={i} location={val.location} level={val.level} parkInfo={val.parkInfo} showElSpaces={props.showElSpaces} name={val.name} idParking={val.idParking} parkedAt={val.parkedAt}></ParkMarker>
        })
      }
    </GoogleMap>
    );
});

Map.displayName = "Map";

export { Map };