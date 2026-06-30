import axios, { AxiosResponse } from "axios";
import { IHirearchyUpdateInterface } from "../../../../../interfaces/AppInterfaces/HirearchyInterface/HirearchyEditInterface/HirearchyUpdateInterface";
import axiosApi from "../../../../../utils/axiosInstance/AxiosConfig";
import { IHirearchyUpdateResponseInterface } from "../../../../../interfaces/AppInterfaces/HirearchyInterface/HirearchyEditInterface/HirearchyUpdateResponseInterface";













async function getUpdateDivisionSubLogin(updateRequest: IHirearchyUpdateInterface): Promise<AxiosResponse<IHirearchyUpdateResponseInterface>> {

    console.log("update request", updateRequest);

    try {
        const response = axiosApi.put('/v2/division-logins', updateRequest);
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new Error('Data not found');
        } else {
            throw new Error('Unexpected Error');
        }
    }
}




export { getUpdateDivisionSubLogin };