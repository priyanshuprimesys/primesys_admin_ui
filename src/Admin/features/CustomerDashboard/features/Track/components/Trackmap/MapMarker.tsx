import Map from "ol/Map";
import Feature from "ol/Feature";
import { fromLonLat } from "ol/proj";
import { Point } from "ol/geom";
import { Icon, Style } from "ol/style";
import markerIcon from "../../../../assets/Icons/startLocation.png";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import { filterMapLiveIcons } from "../../utils/filterMapLiveIcons";
import { TimeStampToDateTime } from "../../../../utils/timeUtils/timeStampToData";

export interface MarkerData {
  coordinates: [number, number];
  name?: string | any;
  imeiNo?: number | any;
  speed?: number|any;
  time?: number|any;
}

/**
 * Adds markers to the map and supports multiple marker configurations.
 * @param map - OpenLayers map instance.
 * @param _popupContainer - HTML div for displaying marker popups.
 * @param markerData - Array of marker data.
 * @returns {VectorLayer | null}
 */
export const MapMarker = (
  map: Map,
  _popupContainer: HTMLDivElement | null,
  markerData: MarkerData[]
): VectorLayer | null => {
  if (!markerData || markerData.length === 0) return null;

  const vectorSource = new VectorSource();

  // Use forEach to iterate over markerData
  markerData.forEach((data) => {
    const { coordinates, name, imeiNo, speed, time } = data;

    if (!coordinates) return;

    const feature = new Feature({
      geometry: new Point(fromLonLat(coordinates)),
      name,
      imeiNo,
      speed,
      time,
    });

    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        src: time && time !== 0 ? filterMapLiveIcons(time) : markerIcon,
      }),
    });

    feature.setStyle(iconStyle);
    vectorSource.addFeature(feature);
  });

  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });

  map.addLayer(vectorLayer);

  // Handle marker click for popup
  map.on("click", function (evt) {
    const clickedFeature = map.forEachFeatureAtPixel(evt.pixel, (feat) => feat);
    if (clickedFeature) {
      const coordinates = evt.coordinate;
      const name = clickedFeature.get("name");
      const imeiNo = clickedFeature.get("imeiNo");
      const speed = clickedFeature.get("speed");
      const time = clickedFeature.get("time");

      if (!name && !imeiNo) {
        return;
      }

      // Set popup content
      const content = `    
       <div style="padding: 8px; font-size: 14px;">
          <strong>Marker Details:</strong><br />
          <strong>Name:</strong> ${name}<br />
          <strong>IMEI:</strong> ${imeiNo}<br />
          <strong>Speed:</strong> ${speed} km/hr<br />
          <strong>Time:</strong> ${TimeStampToDateTime(time)}
        </div>`;
      document.getElementById("popup-content")!.innerHTML = content;
      map.getOverlays().item(0).setPosition(coordinates);
    } else {
      map.getOverlays().item(0).setPosition(undefined);
    }
  });

  return vectorLayer;
};
