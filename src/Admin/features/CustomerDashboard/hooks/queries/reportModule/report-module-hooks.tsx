import { useQuery } from "@tanstack/react-query"
import { customer_report_module } from "../../../queryKey/queryKey"
import { getCustomerReportModule } from "../../../services/apis/reportModule/report-module-api"
import { CustomerLoginDetailContext } from "../../../context/CustomerLoginDetailContext/CustomerLoginDetailContext"
import { useContext } from "react"



export const useGetCustomerReportModule = (divisionId:string) =>{

    const {customerLogged} = useContext(CustomerLoginDetailContext);


    return useQuery({
        queryKey:[customer_report_module],
        queryFn:() => getCustomerReportModule(divisionId),
        retry:false,
        refetchOnMount:false,
        refetchOnWindowFocus:false,
        enabled: !!divisionId && !!customerLogged
    })
}