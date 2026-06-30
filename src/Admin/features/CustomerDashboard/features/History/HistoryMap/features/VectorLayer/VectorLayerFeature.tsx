import { Feature } from "ol";
import { Point } from "ol/geom";
import { Vector } from 'ol/source';
import {Vector as VectorLayer} from "ol/layer"


export const VectorLayerFeature = (iconFeature:Vector<Feature<Point>>) =>{
    const vectorLayer = new VectorLayer({
        source: iconFeature
    });
    return vectorLayer;
}