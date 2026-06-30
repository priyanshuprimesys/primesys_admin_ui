export interface IDivisionRdpsEditInterface{
    id: string,
    kilometer: string,
    distance: number,
    latitude: number,
    longitude: number,
    section:string | null,
    geo_location: {
        type: string,
        coordinates: [
            number,
            number
        ]
    },
    feature_code: number | string | null,
    division_id: string,
    active_status: boolean,
    feature_image: string,
    feature_detail: string,
}