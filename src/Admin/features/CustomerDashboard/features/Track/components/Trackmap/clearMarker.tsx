import { useRef } from "react";
import { Map } from "ol";

export const clearMarker = (mapInstanceRef: React.MutableRefObject<Map | null>, popupRef: React.RefObject<HTMLDivElement>) => {
  const markerRef = useRef<any>(null);

  const clearMarkerPopup = () => {
    if (popupRef.current) {
      // Hide the popup content
      popupRef.current.style.display = "none";
    }

    if (mapInstanceRef.current && markerRef.current) {
      // Remove the marker layer from the map
      mapInstanceRef.current.removeLayer(markerRef.current);
      markerRef.current = null; // Reset the marker reference
    }
  };

  return { clearMarkerPopup, markerRef };
};
