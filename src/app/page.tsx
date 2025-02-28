'use client'

import { ChangeEvent, useRef, useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./components/Button";
import Footer from "./components/Footer";
import { MapWrapper } from "./components/MapWrapper";
import Menu, { MenuHandle } from "./components/Menu";
import styles from "./page.module.css";
import setBtnStyle from "./styles/settingsButton.module.scss";
import { faGear, faLocationCrosshairs, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Settings, { SettingsHandle } from "./components/Settings";
import Checkbox from './components/Checkbox';
import ListView, { ListViewHandle } from './components/ListView';
import { parking } from './data/data';
import { MapHandle } from './components/Map';
import { Autocomplete, LoadScriptNext } from '@react-google-maps/api';
import React from 'react';
import ParkView, { ParkViewHandle } from './components/ParkView';



export default function Home() {
  const [showEl, setShowEl] = useState<boolean>(true);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | undefined>(undefined);
  
  const settingsRef = useRef<SettingsHandle>(null);
  const menuRef = useRef<MenuHandle>(null);
  const mapRef = useRef<MapHandle>(null);
  const listViewRef = useRef<ListViewHandle>(null);
  const parkViewRef = useRef<ParkViewHandle>(null);



  const onSettingsClick = () => {
    if(menuRef.current == null || parkViewRef.current == null || mapRef.current == null || listViewRef.current == null || settingsRef.current == null) return;


    if(menuRef.current.getType() != "settings"){
      menuRef.current.setType("settings");
      settingsRef.current.show(true);
      listViewRef.current.show(false);
      parkViewRef.current.show(false);
    }
    else {
      menuRef.current.setType("hidden");
      settingsRef.current.show(false);
    }
  
  }

  const onShowCharginStation = (val : ChangeEvent<HTMLInputElement>) => setShowEl(val.target.checked);

  const barClick = () => {
    if(menuRef.current == null || parkViewRef.current == null || mapRef.current == null || listViewRef.current == null || settingsRef.current == null) return;

    if(menuRef.current.getType() != "listView"){
      menuRef.current.setType("listView");
      listViewRef.current.show(true);
      settingsRef.current.show(false);
      parkViewRef.current.show(false);
    }
    else {
      menuRef.current.setType("hidden");
      settingsRef.current.show(false);
      listViewRef.current.show(false);
      parkViewRef.current.show(false);
    }

    const parks : parking[] = mapRef.current.getVisibleMarkers();

    listViewRef.current.setParkingSpaces(parks);
  }

  const closeBtnClick = () => {
    if(menuRef.current == null || parkViewRef.current == null || mapRef.current == null || listViewRef.current == null || settingsRef.current == null) return;

    if(menuRef.current.getType() != "listView"){
      menuRef.current.setType("listView");
      listViewRef.current.show(true);
      settingsRef.current.show(false);
      parkViewRef.current.show(false);
    }
    else {
      menuRef.current.setType("hidden");
      settingsRef.current.show(false);
      listViewRef.current.show(false);
      parkViewRef.current.show(false);
    }

    const parks : parking[] = mapRef.current.getCloseParkings();

    listViewRef.current.setParkingSpaces(parks);
  }

  const hideUI = () => {
    if(menuRef.current == null || mapRef.current == null || listViewRef.current == null || settingsRef.current == null || parkViewRef.current == null) return;
    menuRef.current.setType("hidden");
    settingsRef.current.show(false);
    listViewRef.current.show(false);
    parkViewRef.current.show(false);
  }

  const handleSearch = () => {
    if(autocomplete == undefined || mapRef.current == null) return;

    const place : google.maps.places.PlaceResult = autocomplete.getPlace();

    if(place.geometry && place.geometry.location) {

      if(place.types?.indexOf("locality") != -1) {
        mapRef.current.goAndZoom(place.geometry.location, 15);
      } else if(place.types?.indexOf("parking") != -1) {
        mapRef.current.goAndZoom(place.geometry.location, 17);
      }
    }
  };

  const handleGoTo = () => mapRef.current && mapRef.current.goToUser();

  const onGoogleLoad = ()=> {
    //let suggestions = google.maps.places.Place.searchByText({textQuery: "Ljubljana", fields: ["*"], });
    
  }

  const onMarkerClick = (parkingId : number) => {
    if(menuRef.current == null || mapRef.current == null || listViewRef.current == null || settingsRef.current == null || parkViewRef.current == null) return;

    if(menuRef.current.getType() != "parkView"){
      menuRef.current.setType("parkView");
      settingsRef.current.show(false);
      listViewRef.current.show(false);
      parkViewRef.current.show(true);
      parkViewRef.current.setParkingSpace(mapRef.current.getData()[parkingId]);
    } else {
      parkViewRef.current.setParkingSpace(mapRef.current.getData()[parkingId]);
    }
  }

  return (
    <LoadScriptNext googleMapsApiKey="AIzaSyCO0cmq-pEE39lV1ItHRM52pxYyETORlIo" libraries={['places']} onLoad={onGoogleLoad}>
      <div className={styles.page}>
        <Button className={setBtnStyle.settingsButton} onClick={onSettingsClick}>
          <FontAwesomeIcon icon={faGear} size="3x" scale={1} color="white"/>
        </Button>
        <Button className={styles.findClosest} onClick={closeBtnClick}>
          <FontAwesomeIcon icon={faLocationDot} size="3x" />
        </Button>
        <div className={styles.searchBox}>
          <Autocomplete onPlaceChanged={handleSearch} onLoad={setAutocomplete} restrictions={{country : ["si"]}} options={{types: ["parking", "locality"]}}>
            <input type='text' />
          </Autocomplete>
        </div>
        <MapWrapper showElSpaces={showEl} ref={mapRef} onMapClick={hideUI} onMarkerClick={onMarkerClick} />
        <Button className={styles.rtnBtn} onClick={handleGoTo}>
          <FontAwesomeIcon icon={faLocationCrosshairs} size="2x" />
        </Button>
        <Footer>
          <Menu ref={menuRef} type="hidden" barCallBack={barClick}>
            <Settings ref={settingsRef}>
              <Checkbox onChange={onShowCharginStation} checked={showEl}>Show electric chargin stations</Checkbox>
            </Settings>
            <ListView ref={listViewRef} onItemClick={onMarkerClick}>
            </ListView>
            { mapRef.current?
              <ParkView ref={parkViewRef} mapRef={mapRef}></ParkView> : <></>
            }
          </Menu>
        </Footer>
      </div>
    </LoadScriptNext>
  );
}
