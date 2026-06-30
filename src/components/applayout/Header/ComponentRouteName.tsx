import { useContext } from "react";
import { HeaderRouteNameContext } from "../../../contexts/AppLayout/Header/HeaderRouteName/HeaderRouteNameContext";






const ComponentRouteName = () => {

    const {headerComponentName} = useContext(HeaderRouteNameContext);

    return(
        <>
        <p className="m-0 text-xs font-medium underline select-none underline-offset-1">{headerComponentName}</p>
        </>
    )
}




export default ComponentRouteName;