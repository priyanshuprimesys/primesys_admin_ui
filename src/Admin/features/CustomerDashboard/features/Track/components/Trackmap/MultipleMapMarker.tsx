import Map from "ol/Map";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Vector as VectorLayer } from "ol/layer";
import {  Vector as VectorSource } from "ol/source";
import { Icon, Style } from "ol/style";
import { fromLonLat } from "ol/proj";
import { Overlay } from "ol";
import markerIcon from "../../../../assets/Icons/startLocation.png";

const MultipleMapMarker = (map: Map,coordinates: [number, number],index: number,popups: Overlay[],name?: string | any): Overlay => {
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

  const popupContainer = document.createElement("div");
  popupContainer.className = "ol-popup";

  const closer = document.createElement("a");
  closer.href = "#";
  closer.className = "ol-popup-closer";
  closer.onclick = () => {
    popupOverlay.setPosition(undefined);
    closer.blur();
    return false;
  };

  popupContainer.appendChild(closer);
  const content = document.createElement("div");
  content.id = `popup-content-${index}`;
  popupContainer.appendChild(content);

  const popupOverlay = new Overlay({
    element: popupContainer,
    autoPan: {
      animation: {
        duration: 250,
      },
    },
  });

  map.addOverlay(popupOverlay);

  map.on("click", (evt) => {
    const clickedFeature = map.forEachFeatureAtPixel(evt.pixel, (feat) => feat);
    if (clickedFeature && clickedFeature.get("name") === name) {
      const contentHTML = `<div><strong>${name}</strong><br/>Description for ${name}</div>`;
      document.getElementById(`popup-content-${index}`)!.innerHTML = contentHTML;
      popupOverlay.setPosition(evt.coordinate);
    }
  });

  popups.push(popupOverlay);

  return popupOverlay;
};



export default MultipleMapMarker;


