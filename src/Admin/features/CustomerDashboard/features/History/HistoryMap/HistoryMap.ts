import { Map } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import View from "ol/View";
import { defaults } from "ol/control/defaults";
import { defaults as interactionDefaults } from "ol/interaction/defaults";
import { fromLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";
import Point from "ol/geom/Point";
import "./styles/OverlayMapPopupCss.css"







const osmBaseLayer = new TileLayer({
  visible: true,
  source: new OSM()
});

const markerFeature = new Feature({
  geometry: new Point(fromLonLat([77.2088, 28.6139])), 
});

const markerStyle = new Style({
  image: new Icon({
    src: "../../../assets/Icons/startLocation.png", 
    anchor: [0.5, 0.5],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    scale: 0.1, 
  }),
});

markerFeature.setStyle(markerStyle);

const vectorSource = new VectorSource({
  features: [markerFeature],
});


const markerLayer = new VectorLayer({
  source: vectorSource,
});


export const historyMap = new Map({
  target: "map",
  layers: [osmBaseLayer,markerLayer],
  view: new View({
    center: fromLonLat([78.9629, 20.5937]),
    zoom: 5
  }),
  controls: defaults(),
  interactions: interactionDefaults({})
});
