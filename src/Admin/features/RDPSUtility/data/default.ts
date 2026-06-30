import { IDivisionRdpsResponseInterface } from "../../../../interfaces/AppInterfaces/DivisionRdpsInterface/DivisionRdpsResponseInterface";





export const RdpsDefault: IDivisionRdpsResponseInterface={
    data: {
        result: [{
             id:"",
            kilometer:"",
            distance:0,
            geo_location:{
                type:"",
                coordinates:[]
            },
            section:"",
            feature_detail:"",
            feature_code:"",
            feature_image:"",
            division_id:"",
            latitude:0,
            longitude:0,
            active_status: false,
        }]
    },
    success: false
}