'use client'

import { ChangeEvent, useRef, useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./components/Button";
import Footer from "./components/Footer";
import { MapWrapper } from "./components/MapWrapper";
import Menu, { MenuHandle } from "./components/Menu";
import styles from "./page.module.css";
import setBtnStyle from "./styles/settingsButton.module.scss";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import Settings, { SettingsHandle } from "./components/Settings";
import Checkbox from './components/Checkbox';
import ListView, { ListViewHandle } from './components/ListView';
import { parking } from './data/data';
import { MapHandle } from './components/Map';
import { Autocomplete, LoadScriptNext, StandaloneSearchBox } from '@react-google-maps/api';
import React from 'react';



export default function Home() {
  const [showEl, setShowEl] = useState<boolean>(true);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | undefined>(undefined);
  
  const settingsRef = useRef<SettingsHandle>(null);
  const menuRef = useRef<MenuHandle>(null);
  const mapRef = useRef<MapHandle>(null);
  const listViewRef = useRef<ListViewHandle>(null);
  const searchRef = useRef<StandaloneSearchBox>(null);



  const onSettingsClick = () => {
    if(menuRef.current == null || mapRef.current == null || listViewRef.current == null || settingsRef.current == null) return;


    if(menuRef.current.getType() != "settings"){
      menuRef.current.setType("settings");
      settingsRef.current.show(true);
      listViewRef.current.show(false);
    }
    else {
      menuRef.current.setType("hidden");
      settingsRef.current.show(false);
    }
  
  }

  const onShowCharginStation = (val : ChangeEvent<HTMLInputElement>) => setShowEl(val.target.checked);

  const barClick = () => {
    if(menuRef.current == null || mapRef.current == null || listViewRef.current == null || settingsRef.current == null) return;
    
    if(!('getType' in menuRef.current)) return;

    if(menuRef.current.getType() != "listView"){
      menuRef.current.setType("listView");
      listViewRef.current.show(true);
      settingsRef.current.show(false);
    }
    else {
      menuRef.current.setType("hidden");
      settingsRef.current.show(false);
      listViewRef.current.show(false);
    }

    const parks : parking[] = mapRef.current.getVisibleMarkers();

    listViewRef.current.setParkingSpaces(parks);
  }

  const hideUI = () => {
    if(menuRef.current == null || mapRef.current == null || listViewRef.current == null || settingsRef.current == null) return;
    menuRef.current.setType("hidden");
    settingsRef.current.show(false);
    listViewRef.current.show(false);
  }

  const handleSearch = () => {
    if(autocomplete == undefined) return;

    console.log(autocomplete.getPlace());
  };

  const onGoogleLoad = ()=> {
    //let suggestions = google.maps.places.Place.searchByText({textQuery: "Ljubljana", fields: ["*"], });
    
  }

  return (
    <LoadScriptNext googleMapsApiKey="AIzaSyCO0cmq-pEE39lV1ItHRM52pxYyETORlIo" libraries={['places']} onLoad={onGoogleLoad}>
      <div className={styles.page}>
        <Button className={setBtnStyle.settingsButton} onClick={onSettingsClick}>
          <FontAwesomeIcon icon={faGear} size="3x" scale={1} color="white"/>
        </Button>
        <div className={styles.searchBox}>
          <Autocomplete key={1} onPlaceChanged={handleSearch} onLoad={setAutocomplete}>
            <input type='text' />
          </Autocomplete>
        </div>
        <MapWrapper showElSpaces={showEl} ref={mapRef} onMapClick={hideUI} />
        <Footer>
          <Menu ref={menuRef} type="hidden" barCallBack={barClick}>
            <Settings ref={settingsRef}>
              <Checkbox onChange={onShowCharginStation} checked={showEl}>Show electric chargin stations</Checkbox>
            </Settings>
            <ListView ref={listViewRef}>
            </ListView>
          </Menu>
        </Footer>
      </div>
    </LoadScriptNext>
  );
}
