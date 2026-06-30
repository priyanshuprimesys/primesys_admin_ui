import AppCss from "../../../styles/modules/AppStyles/AppCss.module.css";
import { Link } from "react-router-dom";
import { navigationRoutes } from "../../../routes/RouteNavigation";
import { useContext } from "react";
import { HeaderRouteNameContext } from "../../../contexts/AppLayout/Header/HeaderRouteName/HeaderRouteNameContext";

const Sidebar = () => {
  const { setHeaderComponentName } = useContext(HeaderRouteNameContext);

  // const [hoveredItem, setHoveredItem] = useState<boolean>(false);

  // let hoverTimeout: ReturnType<typeof setTimeout>;

  const handleMouseEnter = () => {
    // hoverTimeout = setTimeout(() => setHoveredItem(true), 200);
  };

  const handleMouseLeave = () => {
    // clearTimeout(hoverTimeout);
    // setHoveredItem(false)
  };

  const handleRouteName = (name: string) => {
    setHeaderComponentName(name);
  };

  return (
    <>
      <aside
        id="default-sidebar"
        className={`${AppCss.sidebarContainer} bg-gray-800 text-white transition-all duration-300 ease-out shadow-md`}
        aria-label="Sidebar"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`${AppCss.sidebarJumbotron} z-50 relative`}>
          <ul className={`${AppCss.sidebarMenuList}`}>
            {navigationRoutes.map((menu) => {
              if (menu.isPrivate == true && menu.children) {
                return menu.children.map((r, index) => {
                  if (r.isPrivate && r.isSidebarMenu) {
                    return (
                      <li key={index} className={`${AppCss.sidebarMenuItem}  h-12`}>
                        <Link
                          title={r.name}
                          to={r.path}
                          onClick={() => handleRouteName(r.name)}
                          className={`${AppCss.sidebarMenuItem} z-50 gap-2 cursor-pointer`}
                        >
                          <div className="flex justify-center ">
                            {r.icon}
                          </div>
                     
                            {/* <span className={`text-sm text-white transition-opacity duration-300 ease-in-out  ${hoveredItem ? 'opacity-100' : 'opacity-0'}`}>
                                {r.name}
                            </span> */}
                        </Link>
                      </li>
                    );
                  }
                });
              } else return false;
            })}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
