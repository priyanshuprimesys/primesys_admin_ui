import { Select } from "@chakra-ui/react";
import { ReportStatus } from "../../util/ReportStatusType";


interface DeviceTypeProps{
    onHandleSelect:(value:string)=> void; 
}


const ReportStatusSelect: React.FC<DeviceTypeProps> = ({onHandleSelect}) => {

    const onHandleChange = (e:string) =>{
        onHandleSelect(e);
    }


  return (
    <div className="w-full">
        <Select onChange={(e)=> onHandleChange(e.target.value)}  height={12} borderColor={"black"} borderWidth={2} >
            <option value={ReportStatus.division}>Division</option>
            <option value={ReportStatus.allDivision}>All Division</option>
        </Select>
    </div>
  )
}

export default ReportStatusSelect
