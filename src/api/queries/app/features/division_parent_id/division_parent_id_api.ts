import axios, { AxiosResponse } from "axios";
import { IDivisionParentIdDetailInterface } from "../../../../../interfaces/AppInterfaces/DivisionInterface/DivisionParentIdInterface/DivisionParentIdDetailInterface";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";



async function getDivisionParentId(divisionId:string):Promise<AxiosResponse<IDivisionParentIdDetailInterface>>{

    try{
        const response = await axiosApi.get(`/v2/division-logins/get-division-parents?division_id=${divisionId}`);
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error)){
            throw new Error('Data Not Found');
        }else{
            throw new Error('Unexpected Error');
        }
    }
}



export default getDivisionParentId;
