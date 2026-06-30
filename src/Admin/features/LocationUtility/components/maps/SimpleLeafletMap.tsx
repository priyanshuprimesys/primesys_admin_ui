import { useEffect, useRef } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DeviceLocation } from "../../data/schema";
import { dateTimeUtil } from "../../../../../utils/dateTimeUtils/DateTimeUtil";

const boundsIndia = L.latLngBounds([8.0, 68.0], [37.5, 97.5]);

type Props = {
    locations: DeviceLocation[];
};

export default function SimpleLeafletMap({ locations }: Props) {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const markerLayerRef = useRef<L.LayerGroup | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        mapInstance.current = L.map(mapRef.current);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap",
        }).addTo(mapInstance.current);

        mapInstance.current.fitBounds(boundsIndia);
        setTimeout(() => mapInstance.current?.invalidateSize(), 150);
        markerLayerRef.current = L.layerGroup().addTo(mapInstance.current);

        return () => {
            mapInstance.current?.remove();
            mapInstance.current = null;
        };
    }, []);

    useEffect(() => {
        if (!markerLayerRef.current || !mapInstance.current) return;

        markerLayerRef.current.clearLayers();

        const bounds: L.LatLngTuple[] = [];

        locations.forEach((loc) => {
            const marker = L.marker([loc.lat, loc.lon]).bindPopup(
                `Speed: ${loc.speed} <br/>
                 Date & Time: ${dateTimeUtil.formatToDateTime(loc.timestamp)} <br/>
                 ${loc.blindLocationGetTimestamp != null ? `Blind Location: ${dateTimeUtil.formatToDateTime(loc.blindLocationGetTimestamp)}` : ""}`
            );
            markerLayerRef.current!.addLayer(marker);
            bounds.push([loc.lat, loc.lon]);
        });

        if (bounds.length) {
            mapInstance.current.fitBounds(bounds);
        }
    }, [locations]);

    return <div ref={mapRef} style={{ height: "65vh", width: "100%" }} />;
}
