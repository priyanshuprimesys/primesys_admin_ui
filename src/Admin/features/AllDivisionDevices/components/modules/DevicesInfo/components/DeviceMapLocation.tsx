import { useEffect, useRef } from "react";
import L from 'leaflet';

interface DeviceInfoInterface{
    lat:number | undefined,
    lon:number | undefined,
    speed: number,
    voltageLevel:number,
    signalStrength: number,
}


export const DeviceMapLocation: React.FC<DeviceInfoInterface> = ({lat,lon,speed,signalStrength,voltageLevel}) =>{
 const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);


    useEffect(() => {
        mapRef.current = L.map("map").setView([lat ?? 28.6139, lon ?? 77.2090], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
        }).addTo(mapRef.current);

        markerRef.current = L.marker([lat ?? 28.6139, lon ?? 77.2090]).addTo(mapRef.current);
        markerRef.current.bindPopup(`<b>Speed: ${speed} / km</b>
            <br />
            <b>Network: ${signalStrength}</b>
            <br/>
            <b>Battery: ${voltageLevel}</b>`).openPopup();

        return () => {
        mapRef.current?.remove();
        };
    }, []);

  useEffect(() => {
    if (mapRef.current && lat && lon) {
      mapRef.current.setView([lat, lon], 13);
      markerRef.current?.setLatLng([lat, lon]);
    }
  }, [lat, lon]);

  return (
    <div
      id="map"
      className="mt-5 z-[10] border-2 border-gray-800 rounded-lg"
      style={{ height: "400px", width: "100%" }}
    ></div>
  );
}