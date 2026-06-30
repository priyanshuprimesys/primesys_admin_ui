import { useEffect, useRef } from "react"
import * as L from "leaflet";
import 'leaflet/dist/leaflet.css';
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import * as turf from "@turf/turf";

import { DeviceLocation } from "../../data/schema";
import { dateTimeUtil } from "../../../../../utils/dateTimeUtils/DateTimeUtil";

const boundsIndia = L.latLngBounds([8.0, 68.0], [37.5, 97.5]);

type Props = {
    locations: DeviceLocation[];
    SetMarkersToBeDeleted: React.Dispatch<React.SetStateAction<DeviceLocation[]>>;
    deleteOperationPerformed: boolean;
    setDeleteOperationPerformed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LeafletMap({ locations, deleteOperationPerformed, SetMarkersToBeDeleted, setDeleteOperationPerformed }: Props) {

    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const locationRef = useRef<DeviceLocation[]>(locations);

    const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
    const markerLayerRef = useRef<L.LayerGroup | null>(null);
    const drawControlRef = useRef<L.Control.Draw | null>(null);
    const polygonRef = useRef<L.Polygon | null>(null);


    useEffect(() => {
        if (deleteOperationPerformed && locationRef.current.length != 0) {
            if (!drawnItemsRef.current) return;

            drawnItemsRef.current.eachLayer((layer) => {
                console.log("Each layer removed", layer.remove());
            });
            setDeleteOperationPerformed(false);
        }
    }, [deleteOperationPerformed]);


    useEffect(() => {
        if (locations.length != 0) {
            locationRef.current = locations;
        }
    }, [locations]);

    useEffect(() => {

        if (!mapRef.current || mapInstance.current) return;

        mapInstance.current = L.map(mapRef.current);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap'
        }).addTo(mapInstance.current);

        mapInstance.current.fitBounds(boundsIndia);

        // Leaflet reads container size at init time; Chakra Tabs settles layout
        // after mount, so force a resize after the paint to fix blank map.
        setTimeout(() => mapInstance.current?.invalidateSize(), 150);

        drawnItemsRef.current = new L.FeatureGroup();
        mapInstance.current.addLayer(drawnItemsRef.current);

        markerLayerRef.current = L.layerGroup().addTo(mapInstance.current);

        drawControlRef.current = new L.Control.Draw({
            draw: {
                rectangle: false,
                circle: false,
                polyline: false,
                marker: false,
                circlemarker: false,
            },
            edit: {
                featureGroup: drawnItemsRef.current
            }
        });

        mapInstance.current.addControl(drawControlRef.current);

        mapInstance.current.on(L.Draw.Event.CREATED, (e) => {
            const event = e as L.DrawEvents.Created;
            polygonRef.current = event.layer as L.Polygon;

            drawnItemsRef.current!.addLayer(polygonRef.current);

            const polygonGeometry = polygonRef.current.toGeoJSON().geometry;

            const filteredLocation = locationRef.current.filter(device => {
                const lat = Number(device.lat);
                const lon = Number(device.lon);

                if (!Number.isFinite(lat) || !Number.isFinite(lon)) return false;

                const point = turf.point([lon, lat]);

                return turf.booleanPointInPolygon(point, polygonGeometry);
            });

            SetMarkersToBeDeleted(prev => [...prev, ...filteredLocation]);
        });

        mapInstance.current.on(L.Draw.Event.DELETED, (e) => {
            const event = e as L.DrawEvents.Deleted;

            event.layers.eachLayer((layer) => {
                if (layer instanceof L.Polygon) {

                    const geo = layer.toGeoJSON().geometry;

                    const destroyLocations = locationRef.current.filter(device => {
                        const lat = Number(device.lat);
                        const lon = Number(device.lon);

                        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return false;

                        const point = turf.point([lon, lat]);

                        return turf.booleanPointInPolygon(point, geo);
                    });

                    SetMarkersToBeDeleted(prev =>
                        prev.filter(prevLoc =>
                            !destroyLocations.some(dLoc =>
                                dLoc.lat === prevLoc.lat && dLoc.lon === prevLoc.lon
                            )
                        )
                    );
                }
            });
        });

        return () => {
            mapInstance.current?.remove();
            mapInstance.current = null;
        };

    }, []);


    useEffect(() => {

        if (!markerLayerRef.current || !mapInstance.current) return;

        markerLayerRef.current.clearLayers();

        const bounds: L.LatLngTuple[] = [];

        locations.forEach(loc => {
            const marker = L.marker([loc.lat, loc.lon])
                .bindPopup(
                    `Speed: ${loc.speed} <br/>
                     Date & Time: ${dateTimeUtil.formatToDateTime(loc.timestamp)} <br/>
                     ${loc.blindLocationGetTimestamp != null ? ` Blind Location: ${dateTimeUtil.formatToDateTime(loc.blindLocationGetTimestamp)}` : ''}
                    `
                );

            markerLayerRef.current!.addLayer(marker);
            bounds.push([loc.lat, loc.lon]);
        });

        if (bounds.length) {
            mapInstance.current.fitBounds(bounds);
        }


    }, [locations]);

    return (
        <div
            ref={mapRef}
            style={{
                height: "75vh",
                width: "100%"
            }}
        />
    );
}
