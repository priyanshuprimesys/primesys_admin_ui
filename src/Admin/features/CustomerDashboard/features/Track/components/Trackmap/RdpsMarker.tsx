import Map from "ol/Map";
import Feature from "ol/Feature";
import { fromLonLat } from "ol/proj";
import { Point } from "ol/geom";
import { Icon, Style } from "ol/style";
import { Vector as VectorSource } from "ol/source";
import { Vector as VectorLayer } from "ol/layer";
import Overlay from "ol/Overlay";

export interface RdpsMarkerData {
  coordinates: [number, number];
  distance?: string | any;
  feature_image?: number | any;
  kilometer?: number|any;
}

/**
 * Adds markers to the map and supports multiple marker configurations.
 * @param map - OpenLayers map instance.
 * @param _popupContainer - HTML div for displaying marker popups.
 * @param markerData - Array of marker data.
 * @returns {VectorLayer | null}
 */
export const RdpsMarker = (
  map: Map,
  _popupContainer: HTMLDivElement | null,
  markerData: RdpsMarkerData[]
): VectorLayer | null => {
  if (!markerData || markerData.length === 0) return null;

  const vectorSource = new VectorSource();
  const popups: Overlay[] = [];

  // Use forEach to iterate over markerData
  markerData.forEach((data, index) => {
    const { coordinates, distance, feature_image, kilometer } = data;

    if (!coordinates) return;

    const feature = new Feature({
      geometry: new Point(fromLonLat(coordinates)),
      distance,
      feature_image,
      kilometer,
    });

    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        src: "https://primesystrack.in" + feature_image?.replace("~/Images", "/"),
      }),
    });

    feature.setStyle(iconStyle);
    vectorSource.addFeature(feature);

    // Create popup for each marker
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

    // Handle marker click for popup
    map.on("click", function (evt) {
      const clickedFeature = map.forEachFeatureAtPixel(evt.pixel, (feat) => feat);
      if (clickedFeature && clickedFeature === feature) {
        const coordinates = evt.coordinate;
        const distance = clickedFeature.get("distance");
        const kilometer = clickedFeature.get("kilometer");

        if (!distance && !kilometer) {
          return;
        }

        // Set popup content for clicked marker
        const contentHTML = `
          <div style="padding: 8px; font-size: 14px;">
            <strong>Marker Details:</strong><br />
            <strong>Name:</strong> ${distance}<br />
            <strong>IMEI:</strong> ${kilometer}<br />
          </div>`;
        document.getElementById(`popup-content-${index}`)!.innerHTML = contentHTML;
        popupOverlay.setPosition(coordinates);
      } else {
        popupOverlay.setPosition(undefined);
      }
    });

    // Store the overlay for each marker
    popups.push(popupOverlay);
  });

  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });

  map.addLayer(vectorLayer);

  return vectorLayer;
};
