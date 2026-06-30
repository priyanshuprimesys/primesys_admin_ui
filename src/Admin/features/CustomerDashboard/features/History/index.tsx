import React, { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { Icon, Style } from "ol/style";
import { fromLonLat } from "ol/proj";
import { defaults } from "ol/control/defaults";
import { Overlay } from "ol";
import "./HistoryMap/styles/OverlayMapPopupCss.css";
import markerIcon from "../../assets/Icons/startLocation.png";

// Function to initialize the map
const initializeMap = (
  target: HTMLDivElement,
  centerCoordinates: [number, number],
  popupContainer: HTMLDivElement
  ): Map => {
  const osmBaseLayer = new TileLayer({
    visible: true,
    source: new OSM(),
  });

  const view = new View({
    center: fromLonLat(centerCoordinates),
    zoom: 6,
    minZoom: 5,
    maxZoom: 19,
  });

  const map = new Map({
    layers: [osmBaseLayer],
    target,
    view,
    controls: defaults(),
  });

  // Set up the popup overlay
  const popupOverlay = new Overlay({
    element: popupContainer,
    autoPan: {
      animation: {
        duration: 250,
      },
    },
  });

  map.addOverlay(popupOverlay);

  // Configure popup closer
  const closer = document.getElementById("popup-closer") as HTMLAnchorElement;
  closer.onclick = () => {
    popupOverlay.setPosition(undefined);
    closer.blur();
    return false;
  };

  return map;
};

// Function to add a marker to the map
const addMarker = (
  map: Map,
  coordinates: [number, number],
  name: string,
  _popupContainer: HTMLDivElement
): void => {
  const feature = new Feature({
    geometry: new Point(fromLonLat(coordinates)),
    name,
  });

  const iconStyle = new Style({
    image: new Icon({
      anchor: [0.5, 46],
      anchorXUnits: "fraction",
      anchorYUnits: "pixels",
      src: markerIcon,
    }),
  });

  feature.setStyle(iconStyle);

  const vectorSource = new VectorSource({
    features: [feature],
  });

  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });

  map.addLayer(vectorLayer);

  // Handle marker click for popup
  map.on("click", function (evt) {
    const clickedFeature = map.forEachFeatureAtPixel(evt.pixel, (feat) => feat);
    if (clickedFeature) {
      const geometry = clickedFeature.getGeometry();
      if (geometry && geometry instanceof Point) {
        const featureCoordinates = geometry.getCoordinates();
        const name = clickedFeature.get("name");
  
        // Set popup content
        const content = `<div><strong>${name}</strong><br/>Description for ${name}</div>`;
        document.getElementById("popup-content")!.innerHTML = content;
  
        // Set popup position accurately using the feature's coordinates
        map.getOverlays().item(0).setPosition(featureCoordinates);
      }
    } else {
      map.getOverlays().item(0).setPosition(undefined);
    }
  });

};

// Main component
const CustomerHistory: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const centerCoordinates: [number, number] = [77.2088, 28.6139];

  useEffect(() => {
    if (mapRef.current && popupRef.current) {
      // Initialize the map and store the instance in the ref
      mapInstance.current = initializeMap(mapRef.current, centerCoordinates, popupRef.current);

      return () => {
        mapInstance.current?.setTarget(undefined);
      };
    }
  }, []);

  useEffect(() => {
    if (mapInstance.current && popupRef.current) {
      // Add a marker to the map
      addMarker(mapInstance.current, centerCoordinates, "Location 1",popupRef.current);
    }
  }, []);

  return (
    <div>
      <div ref={mapRef} style={{ height: "80vh", width: "100%" }} />
      <div id="popup" className="ol-popup" ref={popupRef}>
        <a href="#" id="popup-closer" className="ol-popup-closer"></a>
        <div id="popup-content"></div>
      </div>
    </div>
  );
};

export default CustomerHistory;
