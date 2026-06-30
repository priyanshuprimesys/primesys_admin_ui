import axios, { AxiosError, AxiosResponse } from "axios";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";
import { IHirearchyCreateInterface } from "../../../../../interfaces/AppInterfaces/HirearchyInterface/HirearchyCreateInterface/HirearchyCreateInterface";
import { IHirearchySubLoginResponseInterface } from "../../../../../interfaces/AppInterfaces/HirearchyInterface/HirearchyCreateInterface/HirearchySubLoginResponseInterface";








async function postDivisionSubLogin(createDivision:IHirearchyCreateInterface): Promise<AxiosResponse<IHirearchySubLoginResponseInterface>>{

    try{
        const response = await axiosApi.post(`/v2/division-logins`,createDivision);
        return response;
    }catch(error:unknown){
        if(axios.isAxiosError(error))
        {
            const createDivisionError = error as AxiosError<IHirearchySubLoginResponseInterface>
            if(createDivisionError.response?.data.error.code == 10020){
                throw new Error("Username already in use");
            }
            throw new Error('Error not found');
        }else{
            throw new Error('Unexpected Error');
        }
    }
}



export {postDivisionSubLogin};