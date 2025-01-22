'use client'

import { useRef, useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./components/Button";
import Footer from "./components/Footer";
import { MapWrapper } from "./components/MapWrapper";
import Menu from "./components/Menu";
import styles from "./page.module.css";
import setBtnStyle from "./styles/settingsButton.module.scss";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import Settings from "./components/Settings";
import Checkbox from './components/Checkbox';
import ListView from './components/ListView';
import { parking } from './data/data';



export default function Home() {
  let [showEl, setShowEl] = useState<boolean>(true);
  
  const settingsRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef(null);
  const mapRef = useRef(null);
  const listViewRef = useRef(null);


  let onSettingsClick = () => {
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

  let onShowCharginStation = (val : any) => setShowEl(val.target.checked);

  let barClick = () => {
    if(menuRef.current == null || mapRef.current == null || listViewRef.current == null || settingsRef.current == null) return;
    

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

    let parks : parking[] = mapRef.current.getVisibleMarkers();

    listViewRef.current.setParkingSpaces(parks);
  }

  let hideUI = () => {
    if(menuRef.current == null || mapRef.current == null || listViewRef.current == null || settingsRef.current == null) return;
    menuRef.current.setType("hidden");
    settingsRef.current.show(false);
    listViewRef.current.show(false);
  }

  return (
    <div className={styles.page}>
      <Button className={setBtnStyle.settingsButton} onClick={onSettingsClick}>
        <FontAwesomeIcon icon={faGear} size="3x" scale={1} color="white"/>
      </Button>
      <MapWrapper showElSpaces={showEl} ref={mapRef} onMapClick={hideUI} />
      <Footer>
        <Menu ref={menuRef} type="hidden" barCallBack={barClick}>
          <Settings ref={settingsRef}>
            <Checkbox onChange={onShowCharginStation}>Show electric chargin stations</Checkbox>
          </Settings>
          <ListView ref={listViewRef}>
          </ListView>
        </Menu>
      </Footer>
    </div>
  );
}
