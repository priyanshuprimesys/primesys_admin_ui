import Feature from "ol/Feature"
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";



export function IconFeature(lon:number,lat:number,iconName:string){
    const iconFeature = new Feature({
        geometry: new Point(fromLonLat([lon,lat])),
        name:iconName,
    })
    return iconFeature;
}

