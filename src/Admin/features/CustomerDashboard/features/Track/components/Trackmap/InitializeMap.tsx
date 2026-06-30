import {Tile as TileLayer} from "ol/layer";
import View from "ol/View";
import {OSM} from "ol/source";
import { fromLonLat } from "ol/proj";
import Map from "ol/Map";
import { defaults } from "ol/control/defaults";
import { Overlay } from "ol";





export const initializeMap = (target: HTMLDivElement,centerCoordinates: [number, number],popupContainer?: HTMLDivElement): Map => {
    const osmBaseLayer = new TileLayer({
      visible: true,
      source: new OSM(),
    });
  
    const view = new View({
      center: fromLonLat(centerCoordinates),
      zoom: 4,
      minZoom: 5,
      maxZoom: 19,
    });
  
    const map = new Map({
      layers: [osmBaseLayer],
      target,
      view,
      controls: defaults(),
    });


    if(popupContainer)
    {
        const closer = popupContainer.querySelector("#popup-closer") as HTMLAnchorElement;
        if(closer)
        {
            closer.addEventListener("click", (event) => {
                event.preventDefault();
                popupOverlay.setPosition(undefined);
                closer.blur();
              });
        }
  
    }
  
    const popupOverlay = new Overlay({
      element: popupContainer,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });
  
    map.addOverlay(popupOverlay);
  

  
    return map;
  };