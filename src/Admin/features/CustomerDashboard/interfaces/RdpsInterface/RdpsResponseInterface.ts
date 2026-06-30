import { SuccessInterface } from "../SuccessInterface";

interface DivisionRdpsInterface{
    id:string;
    kilometer:string;
    distance:number;
    geoLocation:{
        type:string;
        coordinates:number[]
    };
    section:number;
    featureDetail:string;
    featureCode:string | null;
    feature_image:string;
    divisionId:string;
    latitude:number;
    longitude:number;
}



export interface DivisionRdpsResponse extends SuccessInterface{
    data:{
        result:DivisionRdpsInterface[]
    }
}