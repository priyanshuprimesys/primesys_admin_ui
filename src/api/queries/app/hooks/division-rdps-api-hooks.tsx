import { useMutation } from "@tanstack/react-query"
import { division_rdps_post_query } from "../queryKeys/queryKeys";
import { postDivisionRdps } from "../features/division_rdps_upload/division-rdps-upload-api";
import { RdpsFomrikInterface } from "../../../../interfaces/AppInterfaces/RdpsInterface/RdpsInterface";










export const useDivisionPostRDPS = () =>{
    return useMutation({
        mutationKey:[division_rdps_post_query],
        mutationFn:(request:RdpsFomrikInterface) => {
            return postDivisionRdps(request);
        },
        retry:false,
    });
}