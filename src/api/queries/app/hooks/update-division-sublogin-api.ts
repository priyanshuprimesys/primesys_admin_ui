import { useMutation, useQueryClient } from "@tanstack/react-query"
import { division_parent_key, division_update_sublogin_query_key } from "../queryKeys/queryKeys"
import { getUpdateDivisionSubLogin } from "../features/division_sublogin/update_division_sublogin_api"
import { IHirearchyUpdateInterface } from "../../../../interfaces/AppInterfaces/HirearchyInterface/HirearchyEditInterface/HirearchyUpdateInterface"









export const postUpdateDivisionSubLogin = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [division_update_sublogin_query_key],
        mutationFn: (createDivisionSubLogin: IHirearchyUpdateInterface) => {
            return getUpdateDivisionSubLogin(createDivisionSubLogin)
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: [division_parent_key], exact: true })
        },
        retry: false,
    })
}