import {Icon, Style} from "ol/style";




export function Iconstyle(){
    const iconStyle = new Style({
        image: new Icon({
            anchor:[0.5,46],
            anchorXUnits:'fraction',
            anchorYUnits:'pixels',
            src:'../../../../../assets/Icons/startLocation.png'
        })
    })
    return iconStyle;
}