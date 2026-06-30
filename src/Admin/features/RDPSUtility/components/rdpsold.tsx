import { useCallback, useContext, useEffect, useRef } from "react";
import L from "leaflet";
import { RdpsContext } from "../contexts/RdpsContext";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";

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

    const {rdpsApiLoading} = useContext(RdpsContext);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<L.Map | null>(null);
    const rdpsMarkerRef = useRef<L.Marker[]>([]);
    const controlRef = useRef<L.Control.Layers | null>(null);

    const mapParams: L.MapOptions = {
        center: L.latLng(28.7041, 77.1025),
        zoom: 5,
        zoomControl: false,
        maxBounds: L.latLngBounds(
            L.latLng(-90, -180),
            L.latLng(90, 180)
        ),
        layers: [MAP_TILE],
        maxBoundsViscosity: 1.0
    };

    const initializeControl = useCallback(()=>{
        if(mapRef.current){
            controlRef.current = L.control.layers({
                OpenStreetMap: MAP_TILE,
            }).addTo(mapRef?.current);
                L.control.zoom({
                position:"bottomright",
            }).addTo(mapRef.current);
        }

    },[]);



    useEffect(() => {
        if(rdpsApiLoading){
            return()=>{
                if(mapRef.current)
                mapRef.current.remove();
                mapRef.current = null;
            }
            
        }
        else if(!rdpsApiLoading){
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
        }
      
    }, [initializeControl,rdpsApiLoading]);



    // useEffect(() => {
    // const map = mapRef.current;
    // if (!map) return;

    // if (!rdpsApiLoading && rdpsData?.data) {
    //     rdpsMarkerRef.current.forEach((m) => m.remove());
    //     rdpsMarkerRef.current = [];

    //     const markerCluster = L.markerClusterGroup();

    //     rdpsData.data.result.forEach((device) => {
    //         const isOheMast = device.feature_detail?.toLowerCase().includes("ohe mast");
    //     const rdpsIcon = L.icon({
    //         iconUrl: device.feature_image
    //             ? "https://primesystrack.in" + device.feature_image.replace("~/Images", "/")
    //             : "https://primesystrack.in/default-icon.png",
    //         iconSize: isOheMast ? [38, 95] : [40, 40],
    //         iconAnchor: isOheMast ? [38, 95] : [20, 40],
    //         popupAnchor: [0, -40],
    //     });

    //     const marker = L.marker(
    //         [
    //         device.geo_location.coordinates[1],
    //         device.geo_location.coordinates[0],
    //         ],
    //         { icon: rdpsIcon }
    //     );

    //     const popup = L.popup({
    //         autoClose: false,
    //         closeOnClick: false,
    //     }).setContent(`
    //         <div>
    //             <div>
    //                 <b>Location:</b> ${Math.floor(
    //                 parseInt(device.kilometer)
    //                 )}.${(device.distance / 1000).toFixed(3).split(".")[1]}<br/>
    //                 <b>Feature:</b> ${device.feature_detail}
    //             </div>
    //         </div>    
    //     `);

    //     marker.bindPopup(popup);
    //     markerCluster.addLayer(marker);
    //     });

    //     map.addLayer(markerCluster);

    //     rdpsMarkerRef.current.push(markerCluster as unknown as L.Marker);
    // }
    // }, [rdpsData, rdpsApiLoading]);

    useEffect(() => {
  const map = mapRef.current;
  if (!map || rdpsApiLoading) return;

  // Remove existing marker layers
  rdpsMarkerRef.current.forEach((layer) => map.removeLayer(layer));
  rdpsMarkerRef.current = [];

  // Add VectorGrid layer from TileServer GL
  const vectorGrid = (L as any).vectorGrid.protobuf(
    'http://localhost:8080/data/rdps/{z}/{x}/{y}.pbf', // your TileServer URL
    {
      vectorTileLayerStyles: {
        rdps: () => {
          return {
            radius: 6,
            color: 'red',
            fillColor: 'red',
            fillOpacity: 0.8,
          };
        },
      },
      interactive: true,
      getFeatureId: (feature: any) => feature.properties.id,
    }
  );

  vectorGrid.on('click', (e: any) => {
    const props = e.layer.properties;
    const popupContent = `
      <div>
        <b>Location:</b> ${props.kilometer}.${(props.distance / 1000).toFixed(3).split('.')[1]}<br/>
        <b>Feature:</b> ${props.feature_detail}<br/>
        ${props.feature_image ? `<img src="${props.feature_image}" width="50" />` : ''}
      </div>
    `;
    L.popup()
      .setLatLng(e.latlng)
      .setContent(popupContent)
      .openOn(map);
  });

  vectorGrid.addTo(map);
  rdpsMarkerRef.current.push(vectorGrid);
}, [rdpsApiLoading]);



  return (
    <div className="w-full h-[75vh] my-6 border-2 border-gray-600 rounded">
        {
            rdpsApiLoading ?
            <div className="h-full flex items-center justify-center w-full">
                <h2>Loading.....</h2>
            </div>
            :
            <div ref={mapContainerRef} className="z-20" style={MapStyles}></div>
        }
      
    </div>
  );
};

export default RdpsMap;
