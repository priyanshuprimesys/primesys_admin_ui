import { useContext } from "react";
import { IconsStore } from "../../../global/Icons/IconsStore";
import { UserDetailContext } from "../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import BreadCrumb from "../../../global/components/BreadCrumbs/BreadCrumb";
import ComponentRouteName from "./ComponentRouteName";

const Header = () => {

  const { userDetail } = useContext(UserDetailContext);


  return (
    <div className="absolute top-0 left-0 z-30 w-full px-6 py-3 pl-24 pr-10 mb-2 bg-theme-lightGray">
      <div className="grid grid-cols-3">
        <div className="flex items-center gap-6">
          <BreadCrumb />
          <ComponentRouteName />
        </div>
        <div className="flex justify-center">
          <span className="hidden text-sm font-semibold sm:visible text-dark">Welcome Admin</span>
        </div>
        <div className="flex justify-end gap-8">
          {/* <div className="cursor-pointer">
            {IconsStore.notificationBellIcon}
          </div> */}
          <div className="flex items-center gap-2">
            <div className="cursor-pointer">
              {IconsStore.profileIcon}
            </div>
            <div className="cursor-pointer">
              <span className="font-semibold">{userDetail.data.result.userName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header;
