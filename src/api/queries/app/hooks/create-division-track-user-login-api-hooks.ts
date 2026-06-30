import { useMutation } from "@tanstack/react-query"
import { division_login_track_user_key } from "../queryKeys/queryKeys";
import postDivisionLoginTrackUser from "../features/division_track_user/create_division_login_api";
import { IHirearchyTrackUserRequestInterface } from "../../../../interfaces/AppInterfaces/HirearchyInterface/HirearchyTrackUserInterface/HirearchyTrackUserRequestInterface";





export const postDivisionTrackUser = () => {
    return useMutation({
        mutationKey: [division_login_track_user_key],
        mutationFn: (divisionRequest: IHirearchyTrackUserRequestInterface) => {
            return postDivisionLoginTrackUser(divisionRequest)
        },
        retry: false,
    });
}