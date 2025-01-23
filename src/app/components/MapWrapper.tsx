'use client'

import {Map, MapHandle, MapProps } from "./Map";
import { forwardRef } from "react";



const MapWrapper = forwardRef<MapHandle, MapProps>((props : MapProps, ref) => {
    return <Map {...props} ref={ref}/>;
});

MapWrapper.displayName = "MapWrapper";

export { MapWrapper };