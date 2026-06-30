import { AxiosResponse } from "axios";
import { userAxiosApi } from "../../../../../../services/axiosUser/axios-api-client";
import { RdpsRequestInterface } from "../../../interfaces/RdpsInterface/RdpsRequestInterface";
import { DivisionRdpsResponse } from "../../../interfaces/RdpsInterface/RdpsResponseInterface";





export async function getRdpsDataQuery(request:RdpsRequestInterface):Promise<AxiosResponse<DivisionRdpsResponse>>{
    try
    {
        const response = await userAxiosApi(`/v2/device/rdps-data-div-dist?lat=${request.lat}&lan=${request.lan}&distanceInKilometer=${request.km}&divisionId=${request.divisionId}`);
        return response;
    }catch(error:unknown){
        throw new Error("Network Error");
    }
}