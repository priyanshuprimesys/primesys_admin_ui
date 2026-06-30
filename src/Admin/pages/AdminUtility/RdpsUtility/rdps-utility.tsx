import { RdpsProvider } from "../../../features/RDPSUtility/contexts/RdpsProvider"
import { RDPSUtility } from "../../../features/RDPSUtility/RDPSUtility"




export const RdpsUtilityPage = () =>{
    return(
        <RdpsProvider>
            <RDPSUtility/>
        </RdpsProvider>
    )
}