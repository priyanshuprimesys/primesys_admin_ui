import { CardIconContainer } from "../../../../../global/components";
import { navigationRoutes } from "../../../../../routes/RouteNavigation";

const NavigationIcons = () => {





    return (
        <div className="flex flex-wrap w-full gap-6 ">

            {
                navigationRoutes.map((menu) => {
                    if (menu.isPrivate == true && menu.children) {

                        return menu.children.map((r, index) => {
                            if (r.isPrivate) {
                                return <div key={index}>
                                    <CardIconContainer color={null} innerPath={r.innerPath} icon={r.icon} name={r.name} />
                                </div>
                            }
                        })
                    } else return false;
                })
            }
        </div>
    )
}

export default NavigationIcons;
