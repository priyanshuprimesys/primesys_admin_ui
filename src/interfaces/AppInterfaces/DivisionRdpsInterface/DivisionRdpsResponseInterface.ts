import { SuccessInterface } from "../SuccessResponseInterface/SuccessInterface";

export interface IDivisionRdpsResponseInterface extends SuccessInterface{
    data:{
        result:[{
            id:string;
            kilometer:string;
            distance:number;
            geo_location:{
                type:string;
                coordinates:number[]
            };
            section:number|string | null;
            feature_detail:string;
            feature_code:string | null;
            feature_image:string;
            division_id:string;
            latitude:number;
            longitude:number;
            active_status:boolean;
        }]
    }

}


export interface IDivisionRdpsInterface{
    id:string;
    kilometer:string;
    distance:number;
    geo_location:{
        type:string;
        coordinates:number[]
    };
    section:number|string | null;
    feature_detail:string;
    feature_code:string | null;
    feature_image:string;
    division_id:string;
    latitude:number;
    longitude:number;
    active_status:boolean;
}