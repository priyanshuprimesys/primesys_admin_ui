import axios, {  AxiosResponse } from "axios";
import { IHirearchyTrackUserResponseInterface } from "../../../../../interfaces/AppInterfaces/HirearchyInterface/HirearchyTrackUserInterface/HirearchyTrackUserResponseInterface";
import { IHirearchyTrackUserRequestInterface } from "../../../../../interfaces/AppInterfaces/HirearchyInterface/HirearchyTrackUserInterface/HirearchyTrackUserRequestInterface";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";






async function postDivisionLoginTrackUser(divisionRequest:IHirearchyTrackUserRequestInterface): Promise<AxiosResponse<IHirearchyTrackUserResponseInterface>>{
    try{
        const response = axiosApi.post('/v2/division-logins',divisionRequest);
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error))
        {
            throw new Error("No Data Found");
        }else{
            throw new Error('Unexpected Error');
        }
    }
}




export default postDivisionLoginTrackUser;





