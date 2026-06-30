import { useEffect, useRef } from "react";
import L from 'leaflet';
import { getTimeStampToDate } from "../../../../../../../../utils/hooks/timeStampToDate/getTimeStampToDate";

interface DeviceInfoInterface{
    lat:number | undefined,
    lon:number | undefined,
    speed: number,
    voltageLevel:number,
    signalStrength: number,
    timestamp: number,
    featureDetail: string,
    kilometer: number,
    distance: number
}


export const DeviceMapLocation: React.FC<DeviceInfoInterface> = ({lat,lon,speed,signalStrength,voltageLevel,timestamp,kilometer,distance,featureDetail}) =>{
 const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);


    useEffect(() => {
        mapRef.current = L.map("map").setView([lat ?? 28.6139, lon ?? 77.2090], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
        }).addTo(mapRef.current);

        markerRef.current = L.marker([lat ?? 28.6139, lon ?? 77.2090]).addTo(mapRef.current);
        markerRef.current.bindPopup(`<b>Speed: ${speed ?? ''} / km</b>
            <br />
            <b>Network: ${signalStrength ?? ''}</b>
            <br/>
            <b>Battery: ${voltageLevel ?? ''}</b>
            <br/>
            <b>Date&Time: ${getTimeStampToDate(timestamp) ?? ''}</b>
            <br/>
            <b>Location: ${Math.floor(kilometer)}.${(distance / 1000).toFixed(3).split('.')[1] ?? ''}</b>
            <br/>
            <b>Feature: ${featureDetail ?? ''}</b>`).openPopup();

        return () => {
        mapRef.current?.remove();
        };
    }, [lat,lon,voltageLevel,signalStrength,kilometer,distance,timestamp,featureDetail]);

  useEffect(() => {
    if (mapRef.current && lat && lon) {
      mapRef.current.setView([lat, lon], 13);
      markerRef.current?.setLatLng([lat, lon]);
    }
  }, [lat, lon,voltageLevel,signalStrength,kilometer,distance]);

  return (
    <div
      id="map"
      className=" z-[10]"
      style={{ height: "100%", width: "100%" }}
    ></div>
  );
}