import { useContext } from 'react';
import AppCss from '../../../styles/modules/AppStyles/AppCss.module.css';
import { TbArrowBadgeRightFilled } from "react-icons/tb";
import { TbArrowBadgeLeftFilled } from "react-icons/tb";
import { navigationRoutes } from '../../../routes/RouteNavigation';
import { Link } from 'react-router-dom';
import { HeaderRouteNameContext } from '../../../contexts/AppLayout/Header/HeaderRouteName/HeaderRouteNameContext';
import SubSidebarContext from '../../../contexts/AppLayout/subSidebarContext/SubSideBarContext';



const SubSidebar = () => {

    const { setHeaderComponentName, headerComponentName } = useContext(HeaderRouteNameContext);
    const {setSidebarExpand,sidebarExpand} = useContext(SubSidebarContext);


    const iconSize = 50;
    const iconColor = "#2E6FF2";

    const handleSidebar = () => {
        setSidebarExpand(!sidebarExpand);
        if (sidebarExpand == true) {
            sessionStorage.setItem("sidebarOpenClose", JSON.stringify(false));
        }
        else if (sidebarExpand == false) {
            sessionStorage.setItem("sidebarOpenClose", JSON.stringify(true));
        }
    }

    const handleRouteName = (name: string) => {
        setHeaderComponentName(name);
      };



    return (
        <>
            <div className='relative flex flex-row bg-white'>
                <aside id="default-sub-sidebar" className={sidebarExpand ? `${AppCss.subSidebarContainer}` : `${AppCss.subSidebarContainerClose}`} aria-label='Sub-Sidebar'>
                    <div className={`${AppCss.subSidebarJumbotron}`}>
                        {
                            navigationRoutes.map((item,index)=>(
                                <div key={index} className=' pt-8'>
                                    {item.children && item.children.map((item,index)=>(
                                        <div key={index} className={`h-14 flex items-center border-b-2 border-dashboardGray ${item.name === headerComponentName && 'bg-dashboardGray border-double border-dark'}`}>
                                            <Link onClick={() => handleRouteName(item.name)} key={index} title={item.name} to={item.path} className={`py-4  pl-6 `}>
                                                {
                                                    sidebarExpand &&
                                                    <span
                                                    title={item.name}
                                                    className={`text-base  ${item.name === headerComponentName ? 'font-bold text-dark' : 'text-white'}`}
                                                    
                                                    >
                                                        {item.name}
                                                    </span>
                                                }
                                        
                                            </Link>
                                        </div>
                                        
                                    ))}
                                </div>
                            ))
                        }
                    </div>
                </aside>
                <div className={`${sidebarExpand ? `${AppCss.sidebarIconOpen}` : `${AppCss.sidebarIconClose}`} cursor-pointer`}>
                    {
                        sidebarExpand ?
                        <TbArrowBadgeLeftFilled size={iconSize} color={iconColor} onClick={handleSidebar} />
                        :
                            <TbArrowBadgeRightFilled size={iconSize} color={iconColor} onClick={handleSidebar} />
                    }

                </div>
            </div>
        </>
    )
}



export default SubSidebar;