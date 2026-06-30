import { useRef } from "react";
import {Map} from "ol";
import { map } from "./map";




export function useOpenLayerMap(){
    const mapRef = useRef<Map>();
    if(!mapRef.current)
    {
        mapRef.current = map;
    }
    return mapRef.current;
}