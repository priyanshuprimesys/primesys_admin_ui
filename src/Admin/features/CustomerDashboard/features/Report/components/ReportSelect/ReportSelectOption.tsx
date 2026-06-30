import ChakraUISelectBox from "../../../../../../../global/ChakraUIComponents/SelectBox/ChakraUISelectBox";
import { useContext, useState } from "react";
import { CustomerReportModuleContext } from "../../../../context/CustomerReportContext/CustomerReportModuleContext";
import { SubModuleInterface } from "../../../../interfaces/ReportModuleInterface/ReportModuleInterface";
import DatePicker from "react-datepicker";
import "../styles/datePickerCss.css";
import InputWithSearch from "../../../../../../../global/components/input/InputWithSearch/InputWithSearch";
import { CustomerLoginDetailContext } from "../../../../context/CustomerLoginDetailContext/CustomerLoginDetailContext";
import { CustomerDivisionDevicesContext } from "../../../../context/DivisionDevicesContext/CustomerDivisionDevicesContext";

const exceptionMod = "Exception_Report";
const deviceSignal = "Device_Signal_Info";
const batteryStatus = "Device_Battery_Status";
const deviceOnOFF = "Device_ON_OFF_Status";
const countReport = "Count_Status_Report";
const divisionStatus = "Division_Status_Report";
const monitorSoS = "Monitor_SOS_Press";

const ReportSelectOption = () => {
  const { reportModule } = useContext(CustomerReportModuleContext);
  const [startDate, setStartDate] = useState(new Date());
  const [parentReportValue, setParentReportValue] = useState<string>("");
  const [_childReportValue, setChildReportValue] = useState<string>("");
  const [_studentDeviceImei, setStudentDeviceImei] = useState<string>("");
  const { parentId } = useContext(CustomerLoginDetailContext);
  const { customerDivisionDevices } = useContext(CustomerDivisionDevicesContext);




  const selectSubModule: SubModuleInterface[] =
    reportModule.data.result.flatMap((element) =>
      (element.subModules || [])
        .filter((subModule) => subModule !== null && subModule !== undefined)
        .map((subModule) => ({
          id: subModule.id,
          moduleName: subModule.moduleName,
          displayName: subModule.displayName,
          displayOrder: subModule.displayOrder,
          subModules: subModule.subModules,
          typeId: subModule.typeId,
        }))
    );


  return (
    <>
      <div className="flex justify-center w-full">
        <div className="flex gap-2 w-[60vw]">
          <ChakraUISelectBox
            data={reportModule.success === true ? reportModule.data.result : []}
            Label={"displayName"}
            Value="moduleName"
            placeHolder="Select Report Type"
            setSelectValue={setParentReportValue}
          />
          {parentReportValue === exceptionMod ||
          parentReportValue === countReport ||
          parentReportValue === divisionStatus ? (
            <ChakraUISelectBox
              data={reportModule.success === true ? selectSubModule : []}
              Label={"displayName"}
              Value="typeId"
              placeHolder="Select Report Type"
              setSelectValue={setChildReportValue}
            />
          ) : (
            ""
          )}

          {parentReportValue === exceptionMod ||
          parentReportValue === deviceOnOFF ||
          parentReportValue === monitorSoS ||
          parentReportValue === countReport ||
          parentReportValue === divisionStatus ? (
            <div className="w-full">
              <DatePicker
                selected={startDate}
                dateFormat={"dd/MM/yyyy"}
                className="py-1.5 border-2 focus:border-2 rounded px-2 w-full text-center border-black"
                onChange={(date) => setStartDate(date ? date : new Date())}
              />
            </div>
          ) : (
            ""
          )}

          {parentReportValue === deviceSignal ||
          parentReportValue === batteryStatus ? (
            <InputWithSearch
              dataClear={parentId === "" ? true : false}
              setSelectedValue={setStudentDeviceImei}
              selectedVal="imeiNo"
              data={customerDivisionDevices.data.result ?? []}
              name="name"
              className="!py-1.5 !text-sm bg-white text-black"
              placeHolder="Enter Student Name"
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default ReportSelectOption;
