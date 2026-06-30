import { Feature } from "ol";
import { Point } from "ol/geom";
import { Vector } from "ol/source";


export const VectorSourceFeature = (iconFeature:Feature<Point>) =>{
    const Source = new Vector({
        features:[iconFeature],
    });
    return Source;
}