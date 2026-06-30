declare module "@mapbox/leaflet-pip" {
    import * as L from "leaflet";

    const leafletPip: {
        pointInLayer(
            latlng: L.LatLngExpression,
            layer: L.Layer
        ): L.Layer[];
    };

    export default leafletPip;
}
