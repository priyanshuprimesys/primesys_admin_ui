import { IDivisionRdpsResponseInterface } from "../../../interfaces/AppInterfaces/DivisionRdpsInterface/DivisionRdpsResponseInterface";

export const DivisionRdpsResponseInitialState:IDivisionRdpsResponseInterface={
    data: {
        result: [{
            id: "",
            kilometer: "",
            distance: 0,
            geo_location: {
                type: "",
                coordinates: []
            },
            section: 0,
            feature_detail: "",
            feature_code: null,
            feature_image: "",
            division_id: "",
            latitude: 0,
            longitude: 0,
            active_status: false
        }]
    },
    success: false
}