import { IoArrowForwardOutline } from "react-icons/io5";
import { MdAppSettingsAlt } from "react-icons/md";
import { FaPersonDigging } from "react-icons/fa6";
import { GiFamilyTree } from "react-icons/gi";
import { CgTrack } from "react-icons/cg";
import { IoIosCreate } from "react-icons/io";
import { FaExchangeAlt } from "react-icons/fa";
import { FaServer } from "react-icons/fa";
import { BsDeviceSsdFill } from "react-icons/bs";
import { TbDatabasePlus } from "react-icons/tb";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { IoMdLogOut } from "react-icons/io";
import { FaBell } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoMdHome } from "react-icons/io";
import { FaUsersCog } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { HiMiniCommandLine } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { BsToggleOff } from "react-icons/bs";
import { BsToggleOn } from "react-icons/bs";
import { FiCopy } from "react-icons/fi";
import { FaFilter } from "react-icons/fa";
import { IoMdFastforward } from "react-icons/io";
import { AiOutlineBackward } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { MdCheckBox } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { LuRefreshCw } from "react-icons/lu";
import { FaInfoCircle } from "react-icons/fa";
import { LuServerOff } from "react-icons/lu";
import { BsSendCheckFill } from "react-icons/bs";
import { FaFilePdf } from "react-icons/fa6";
import { RiFileExcel2Fill } from "react-icons/ri";
import { ImHistory } from "react-icons/im";
import { TbNetworkOff } from "react-icons/tb";
import { RiFileList3Fill } from "react-icons/ri";
import { LuCalendarDays } from "react-icons/lu";
import { TbRecharging } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import { FaBars } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import { BiError } from "react-icons/bi";
import { RiRedPacketLine } from "react-icons/ri";
import { FcInspection } from "react-icons/fc";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FaUnlockAlt } from "react-icons/fa";
import { MdConfirmationNumber } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdSos } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";


/***
 * Constant Call
 */
import { AppColor } from "../../constants/color/AppColor";

export const iconColor = "#fbfbfb";
export const iconColorBlack = "#000000";

export const iconSize = 20;

export const IconsStore = {
  rightArrowLLink: <IoArrowForwardOutline color={iconColorBlack} size={22} />,
  deviceConfigurationIcon: (
    <MdAppSettingsAlt size={iconSize} color={iconColor} />
  ),
  deviceDiagnoseIcon: <BsDeviceSsdFill size={iconSize} color={iconColor} />,
  deviceExchangeIcon: <FaExchangeAlt size={iconSize} color={iconColor} />,
  deviceUnRegisterIcon: <TbDatabasePlus size={iconSize} color={iconColor} />,
  hirearchyModuleIcon: <GiFamilyTree size={iconSize} color={iconColor} />,
  issueTrackingIcon: <CgTrack size={iconSize} color={iconColor} />,
  keymanBeatIcon: <FaPersonDigging size={iconSize} color={iconColor} />,
  patrolmanBeatIcon: <FaPersonDigging size={iconSize} color={iconColor} />,
  severStaticsIcon: <FaServer size={iconSize} color={iconColor} />,
  studentNameUpdateIcon: <IoIosCreate size={iconSize} color={iconColor} />,
  dashboardIcon: (
    <RiDashboardHorizontalFill size={iconSize} color={iconColor} />
  ),
  logOutIcon: <IoMdLogOut size={iconSize} color={iconColor} />,
  notificationBellIcon: <FaBell size={iconSize} color={"#0D1526"} />,
  profileIcon: <CgProfile size={iconSize} color={"#0D1526"} />,
  usersWindow: <FaUsersCog size={iconSize} color={iconColor} />,
  historyIcon: <ImHistory size={iconSize} color={iconColor} />,
  listIcon: <RiFileList3Fill size={iconSize} color={iconColor} />,
  calendarIcon: <LuCalendarDays size={iconSize} color={iconColor} />,
  rechargeIcon: <TbRecharging size={iconSize + 4} color={iconColor} />,
  deleteIcon: <MdDeleteOutline size={iconSize} color={AppColor.error} />,
  editIcon: <FaEdit size={iconSize} color={AppColor.warning} />,
  websiteIcon: <CgWebsite size={iconSize} color={iconColor} />,
  packetIcon: <RiRedPacketLine size={iconSize} color={iconColor} />,
  inspection: <FcInspection size={iconSize} color={iconColor} />,
  mapIcon: <FaMapMarkedAlt size={iconSize} color={iconColor} />,
  permissionIcon: <FaUnlockAlt size={iconSize} color={iconColor} />,
  ticketIcon: <MdConfirmationNumber size={iconSize} color={iconColor} />,
  operationsIcon: <MdSos size={iconSize} color={iconColor} />,
  emailIcon: <MdOutlineEmail size={iconSize} color={iconColor} />,
};

export const AppIcons = {
  homeIcon: <IoMdHome size={iconSize} color={"#0D1526"} />,
};

export const IconComponents = {
  searchIcon: <IoSearch size={iconSize} color={AppColor.black} />,
  commandIcon: <HiMiniCommandLine size={iconSize} color={AppColor.black} />,
  closeIcon: <IoMdClose size={iconSize} color={AppColor.black} />,
  toggleOnButton: <BsToggleOn size={iconSize} color={AppColor.white} />,
  toggleOffButton: <BsToggleOff size={iconSize} color={AppColor.white} />,
  copyIcon: <FiCopy size={iconSize} color={AppColor.black} />,
  filterIcon: <FaFilter size={iconSize - 1} color={AppColor.black} />,
  filterWhiteIcon: <FaFilter size={iconSize - 3} color={AppColor.white} />,
  forwardIcon: <IoMdFastforward size={iconSize - 1} color={AppColor.white} />,
  backwradIcon: (
    <AiOutlineBackward size={iconSize - 1} color={AppColor.white} />
  ),
  addIcon: (
    <IoMdAdd className="font-bold" size={iconSize} color={AppColor.white} />
  ),
  emptyBox: (
    <MdCheckBoxOutlineBlank
      className="font-bold"
      size={iconSize + 2}
      color={AppColor.black}
    />
  ),
  selectedBox: (
    <MdCheckBox
      className="font-bold"
      size={iconSize + 2}
      color={AppColor.black}
    />
  ),
  editIcon: <FaEdit size={iconSize} color={AppColor.white} />,
  refreshIcon: <LuRefreshCw size={iconSize} color={AppColor.white} />,
  moreInfoIcon: <FaInfoCircle size={iconSize - 2} color={AppColor.themeDark} />,
  serverOff: <LuServerOff size={iconSize} color={AppColor.error} />,
  sentSuccess: <BsSendCheckFill size={iconSize} color={AppColor.success} />,
  pdfIcon: <FaFilePdf size={iconSize} color={AppColor.white} />,
  excelIcon: <RiFileExcel2Fill size={iconSize + 8} color={AppColor.black} />,
  networkDown: <TbNetworkOff size={iconSize} color={AppColor.error} />,
  barIcon: <FaBars size={iconSize} color={AppColor.black} />,
  errorIcon: <BiError size={30} color={AppColor.error} />,
  rightArrowIcon: <FaArrowRightLong size={iconSize} color={AppColor.black} />
};
