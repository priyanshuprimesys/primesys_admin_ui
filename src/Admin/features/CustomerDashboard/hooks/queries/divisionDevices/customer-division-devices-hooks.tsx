import { useQuery } from "@tanstack/react-query"
import { customer_division_all_devices } from "../../../queryKey/queryKey"
import { getDivisionAllDevices } from "../../../services/apis/divisionAllDevices/division-all-devices-api"
import { useContext } from "react"
import { CustomerLoginDetailContext } from "../../../context/CustomerLoginDetailContext/CustomerLoginDetailContext"




export const useGetDivisionDevices = (divisionId:string) =>{
    
    const {customerLogged} = useContext(CustomerLoginDetailContext);

    return useQuery({
        queryKey:[customer_division_all_devices],
        queryFn:()=> getDivisionAllDevices(divisionId),
        retry:false,
        refetchOnMount:false,
        refetchOnWindowFocus:false,
        enabled:!!divisionId && !!customerLogged
    });
}