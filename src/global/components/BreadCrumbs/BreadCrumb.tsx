import { useContext } from "react";
import { AppIcons } from "../../Icons/IconsStore";
import { Link } from "react-router-dom";
import { HeaderRouteNameContext } from "../../../contexts/AppLayout/Header/HeaderRouteName/HeaderRouteNameContext";




const BreadCrumb = () => {

    const {setHeaderComponentName} = useContext(HeaderRouteNameContext);

    return (
        <>
            <div className="flex items-center gap-1 ">
                <Link to={'/admin'} onClick={()=>setHeaderComponentName('Dashboard')} className="flex items-center">
                    <div className="cursor-pointer">
                        {AppIcons.homeIcon}
                    </div>
                    <div>
                        <p className="pt-1 m-0 text-xs underline">Home</p>
                    </div>
                </Link>
            </div>
        </>
    )
}



export default BreadCrumb;