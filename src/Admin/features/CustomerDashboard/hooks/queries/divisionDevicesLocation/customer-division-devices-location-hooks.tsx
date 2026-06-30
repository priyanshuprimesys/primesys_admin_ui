import { useQuery } from "@tanstack/react-query"
import { customer_division_devices_location } from "../../../queryKey/queryKey"
import { getDivisionDevicesLocation } from "../../../services/apis/divisionDevicesLocationDetails/division-all-devices-location-api"
import { CustomerLoginDetailContext } from "../../../context/CustomerLoginDetailContext/CustomerLoginDetailContext"
import { useContext } from "react"



export const useGetDivisionDevicesLocation =(divisionId:string) =>{

    const {customerLogged} = useContext(CustomerLoginDetailContext);



    return useQuery({
        queryKey:[customer_division_devices_location],
        queryFn:()=> getDivisionDevicesLocation(divisionId),
        retry:false,
        refetchOnMount:false,
        refetchOnWindowFocus:false,
        enabled:!!divisionId && !!customerLogged
    })
}