import { useContext, useEffect, useRef, useState } from "react";
import DeviceSidebar from "./components/DeviceSidebar/DeviceSidebar";
import { Map } from "ol";
import { initializeMap } from "./components/Trackmap/InitializeMap";
import { MapMarker, MarkerData } from "./components/Trackmap/MapMarker";
import { WebSocketDataContext } from "../../context/WebSocketContext/WebSocketDataContext";
import { fromLonLat } from "ol/proj";
import TrackHeader from "./components/TrackHeader/TrackHeader";
import { useRdpsData } from "../../hooks/queries/rdpsData/rdps-data-hooks";
import { RdpsRequestInterface } from "../../interfaces/RdpsInterface/RdpsRequestInterface";
import { RdpsMarker, RdpsMarkerData } from "./components/Trackmap/RdpsMarker";

const CustomerTrack = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const rdpspopupRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const centerCoordinates: [number, number] = [78.0081, 27.1767];
  const markerRef = useRef<any>(null);
  const rdpsmarkerRef = useRef<any>(null);
  const { webSocketData,webSocketLiveName,webSocketdivisionId,webSocketLiveImei } = useContext(WebSocketDataContext);
  const [rdpsRequest,setRdpsRequest] = useState<RdpsRequestInterface>({lat:0,lan:0,divisionId:'',km:0});
  const {data,isSuccess} = useRdpsData(rdpsRequest);


  useEffect(() => {
    if (mapRef.current) {
      // Initialize the map
      mapInstance.current = initializeMap(
        mapRef.current,
        centerCoordinates,
        popupRef.current || undefined // Pass `undefined` if `popupRef` is null
      );

      return () => {
        mapInstance.current?.setTarget(undefined);
      };
    }
  }, []);
  const closePopup = () => {
    if (mapInstance.current) {
      const overlay = mapInstance.current.getOverlays().item(0); // Get the first overlay (your popup)
      if (overlay) {
        overlay.setPosition(undefined); // This hides the popup
      }
    }
  };

  useEffect(() => {
    if (mapInstance.current && popupRef.current && webSocketData !== null) {
      // Remove old marker layer if it exists
      closePopup();
      if (markerRef.current) {
        mapInstance.current.removeLayer(markerRef.current);
      }

      setRdpsRequest(()=>({
        lat:webSocketData.data.lat,
        lan:webSocketData.data.lan,
        divisionId:webSocketdivisionId,
        km:20,
      }))
      const marker: MarkerData[] = [
        {
          coordinates: [webSocketData.data.lan, webSocketData.data.lat] as [number, number],
          name: webSocketLiveName,
          imeiNo: webSocketLiveImei,
          speed: webSocketData.data.speed,
          time: webSocketData.data.timestamp,
        },
      ];

      // Add a new marker and store the layer in the ref
      const newMarker = MapMarker(
        mapInstance.current,
        popupRef.current,
        marker
      );

      // Store the new marker in ref for future removal
      if (newMarker) {
        markerRef.current = newMarker;
      }

      const newCenter: [number, number] = [webSocketData?.data.lan, webSocketData?.data.lat];
      const zoom = 14;
      mapInstance.current.getView().setCenter(fromLonLat(newCenter));
      mapInstance.current.getView().setZoom(zoom);
    }else if(mapInstance.current &&  popupRef.current && webSocketData === null){
      if (markerRef.current) {
        mapInstance.current.removeLayer(markerRef.current);
      }

      // const marker = [
      //   { coordinates: [77.5946, 12.9716], name: "Bangalore", imeiNo: 123456789, speed: 40, time: Date.now() },
      // ]


      // MapMarker(mapInstance,0, null,[{coordinates:[77.2088,28.6139]}]);
      mapInstance.current.getView().setCenter(fromLonLat([77.2088,28.6139]));
      mapInstance.current.getView().setZoom(5);
    }
  }, [webSocketData]);

  useEffect(() => {
    if (isSuccess && data) {
      const marker: RdpsMarkerData[] = data.data.data.result.map((item) => ({
        coordinates: [item.longitude, item.latitude] as [number, number],
        feature_image: item.feature_image,
        distance: item.distance,
        kilometer: item.kilometer,
      }));
  
  
      if (mapInstance.current) {
        closePopup();
        if (rdpsmarkerRef.current) {
          mapInstance.current.removeLayer(rdpsmarkerRef.current);
        }
        if (rdpsmarkerRef.current) {
          mapInstance.current.removeLayer(rdpsmarkerRef.current);
        }
  
        // Add a new marker and store the layer in the ref
        const newMarker = RdpsMarker(mapInstance.current, rdpspopupRef.current, marker);
  
        // Store the new marker in ref for future removal
        if (newMarker) {
          rdpsmarkerRef.current = newMarker;
        }
      }
    }
  }, [data, isSuccess]);





  return (
    <>
      <div className="h-[80vh] w-[100%] relative" ref={mapRef}>
        <TrackHeader/>
        <DeviceSidebar />
      </div>
      <div id="popup" className="ol-popup" ref={popupRef}>
        <a href="#" id="popup-closer" className="ol-popup-closer"></a>
        <div id="popup-content"></div>
      </div>
    </>
  );
};

export default CustomerTrack;
