import { useCallback, useContext, useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { RdpsContext } from "../contexts/RdpsContext";

export const MAP_TILE = L.tileLayer(
  `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`,
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
);

export const MapStyles: React.CSSProperties = {
  overflow: "hidden",
  width: "100%",
  height: "100%",
};

const RdpsMap = () => {
  const { rdpsData, rdpsApiLoading } = useContext(RdpsContext);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const rdpsMarkerRef = useRef<L.Marker[]>([]);
  const controlRef = useRef<L.Control.Layers | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<any[]>([]);

  const mapParams: L.MapOptions = {
    center: L.latLng(28.7041, 77.1025),
    zoom: 5,
    zoomControl: false,
    maxBounds: L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180)),
    layers: [MAP_TILE],
    maxBoundsViscosity: 1.0,
  };

  const initializeControl = useCallback(() => {
    if (mapRef.current) {
      controlRef.current = L.control
        .layers({ OpenStreetMap: MAP_TILE })
        .addTo(mapRef.current);
      L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);
    }
  }, []);

  useEffect(() => {
    if (rdpsApiLoading) return;

    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, mapParams);
      initializeControl();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [initializeControl, rdpsApiLoading]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || rdpsApiLoading || !rdpsData?.data) return;

    // Remove previous markers
    rdpsMarkerRef.current.forEach((layer) => map.removeLayer(layer));
    rdpsMarkerRef.current = [];

    const markerCluster = L.markerClusterGroup();

    rdpsData.data.result.forEach((device: any) => {
      const isOheMast = device.feature_detail?.toLowerCase().includes("ohe mast");
      const rdpsIcon = L.icon({
        iconUrl: device.feature_image
          ? "https://primesystrack.in" + device.feature_image.replace("~/Images", "/")
          : "https://primesystrack.in/default-icon.png",
        iconSize: isOheMast ? [50, 95] : [40, 40],
        iconAnchor: isOheMast ? [25, 95] : [20, 40],
        popupAnchor: [0, -40],
      });

      const marker = L.marker(
        [device.geo_location.coordinates[1], device.geo_location.coordinates[0]],
        { icon: rdpsIcon }
      ) as any;

      marker.device = device;

      marker.on("click", () => {
        setModalData([device]); // single marker
        setModalVisible(true);
      });

      markerCluster.addLayer(marker);
    });

    markerCluster.on("clusterclick", (a: any) => {
      const markers = a.layer.getAllChildMarkers();
      if (markers.length <= 24) {
        setModalData(markers.map((m: any) => m.device));
        setModalVisible(true);
      } else {
        map.fitBounds(a.layer.getBounds()); // zoom into big clusters
        setModalVisible(false);
      }
    });

    map.addLayer(markerCluster);
    rdpsMarkerRef.current.push(markerCluster as unknown as L.Marker);
  }, [rdpsData, rdpsApiLoading]);

  return (
    <div className="w-full h-[75vh] my-6 border-2 border-gray-600 rounded relative">
      {rdpsApiLoading && (
        <div className="h-full flex items-center justify-center w-full">
          <h2>Loading.....</h2>
        </div>
      )}

      <div ref={mapContainerRef} className="z-20" style={MapStyles}></div>

      {/* Modal */}
      {modalVisible && (
        <>
          <div
            className="absolute top-0 right-0 h-full w-80 bg-white/90 shadow-lg p-4 overflow-auto z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold mb-2">Marker Details</h3>
            {modalData.map((d: any) => (
              <div key={d.id} className="border-b py-2">
                <div><b>Feature:</b> {d.feature_detail}</div>
                <div><b>Location:</b> {Math.floor(parseInt(d.kilometer))}.{(d.distance/1000).toFixed(3).split('.')[1]}</div>
                {d.feature_image && <img src={"https://primesystrack.in" + d.feature_image.replace("~/Images","/")} width={50} />}
              </div>
            ))}
            <button
              className="mt-2 px-2 py-1 bg-red-500 text-white rounded"
              onClick={() => setModalVisible(false)}
            >
              Close
            </button>
          </div>

          {/* Overlay for outside click */}
          <div
            className="absolute top-0 left-0 w-full h-full z-40"
            onClick={() => setModalVisible(false)}
          />
        </>
      )}
    </div>
  );
};

export default RdpsMap;
