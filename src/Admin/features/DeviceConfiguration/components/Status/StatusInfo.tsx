import { IconComponents } from "../../../../../global/Icons/IconsStore"




const StatusInfo = () => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 border-2 border-gray-400 rounded cursor-not-allowed select-none border-b-black">
        <div className="flex items-center space-x-2 border-black border-r-2 px-1">
            {IconComponents.serverOff}
            <p className="m-0 text-xss">Server Not Connected</p>
        </div>
        <div className="flex items-center space-x-2 border-black border-r-2 px-1">
            {IconComponents.sentSuccess}
            <p className="m-0 text-xss">Sent successfully</p>
        </div>
        <div className="flex items-center space-x-2 ">
            {IconComponents.networkDown}
            <p className="m-0 text-xss">Node down</p>
        </div>
    </div>
  )
}

export default StatusInfo
