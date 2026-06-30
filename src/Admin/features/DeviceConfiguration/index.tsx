import ConfigCommandSearchSelect from "./components/ConfigurationCommandSelect/ConfigCommandSearch/ConfigCommandSearchSelect";
import { SelectedCommand } from "./components/ConfigurationCommandSelect/SelectedCommand/SelectedCommand";
import ParentSearchSelect from "./components/ParentSearchSelect/ParentSearchSelect";
import StudentDevicesPanel from "./components/StudentDevicesPanel/StudentDevicesPanel";
import CustomCommandModal from "./components/ConfigurationCommandSelect/CustomCommandModals/CustomCommandModal";
import Button from "../../../global/components/button/Button";
import { useContext, useEffect } from "react";
import { DeviceStudentSelectContext } from "../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceStudentsSelectContext/DeviceStudentsSelectContext";
import { useErrorNotification } from "../../../utils/hooks/notification/useErrorNotification";
import { usePostSendDeviceCommand } from "../../../api/queries/app/hooks/device-send-command-api-hooks";
import { useSuccessNotification } from "../../../utils/hooks/notification/useSuccessNotification";
import ConfigurationDataTable from "./components/ConfigurationDataTable/ConfigurationDataTable";
import { DeviceCommandContext } from "../../../contexts/AppLayout/Admin/DeviceConfigurationContext/DeviceCommandContext/DeviceCommandContext";
import { DivisionParentIdContext } from "../../../contexts/AppLayout/Admin/DivisionParentIdContext/DivisionParentIdContext";
import { StudentDeviceDetailContext } from "../../../contexts/AppLayout/Admin/StudentDeviceDetailContext/StudentDeviceDetailContext";
import { StudentDeviceDetailInitialState } from "../../../initialStates/AppInitialStates/StudentDeviceInitialState/StudentDeviceDetailInitialState";
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
} from "@chakra-ui/react";
import BroadcastConnectedCommand from "./features/broadcast_command";
import { UserDetailContext } from "../../../contexts/AppLayout/UserDetailContext/UserDetailContext";

/** Role allowed to broadcast commands / control the server. */
const SERVER_OPS_ROLE_ID = 20;



const DeviceConfiguration = () => {

    const { studentSelectedDevices, setSelectAllStudent, setStudentActive, setStudentTypeId, setStudentSelectedDevices } = useContext(DeviceStudentSelectContext);
    const { deviceCommand, periodCommandBool, setStartTimeOne, setStartTimeTwo, setEndTimeOne, setEndTimeTwo,setDeviceCommand } = useContext(DeviceCommandContext);
    const { setStudentDeviceDetail } = useContext(StudentDeviceDetailContext);
    const { parentDivisionId, setParentDivisionId } = useContext(DivisionParentIdContext);
    const { userDetail } = useContext(UserDetailContext);
    const canBroadcast = userDetail?.data?.result?.roleId === SERVER_OPS_ROLE_ID;

    const { mutate, data, isSuccess, isError, isPending } = usePostSendDeviceCommand();


    useEffect(() => {
        setParentDivisionId('');
        setStudentSelectedDevices([]);
        setStudentActive("all");
        setSelectAllStudent(false);
        setStudentDeviceDetail(StudentDeviceDetailInitialState);
    }, []);


    const onHandleSubmit = () => {

      
        if (studentSelectedDevices.length == 0 || parentDivisionId == "" || deviceCommand == "") {
            useErrorNotification('No Device Selected');
            return;
        }
        else if (studentSelectedDevices.length != 0 && parentDivisionId !== "" && deviceCommand != "") {
            mutate(periodCommandBool ? studentSelectedDevices.flat() : studentSelectedDevices);
        }
    }

    const onCancelSubmit = () => {
        setSelectAllStudent(false);
        setStudentActive("all");
        setStudentTypeId('');
        useErrorNotification('Command Cleared');
        setStudentSelectedDevices([]);
        setStartTimeOne("");
        setStartTimeTwo("");
        setEndTimeOne("");
        setEndTimeTwo("");
        setDeviceCommand("");
        setStudentDeviceDetail(StudentDeviceDetailInitialState)
    }


    useEffect(() => {
        if (isSuccess) {
            setSelectAllStudent(false);
            // setStudentActive("all");
            useSuccessNotification('Command Send Successfully');
            // setStudentSelectedDevices([]);
        }
        else if (isError) {
            setSelectAllStudent(false);
            // setStudentActive("all");
            useErrorNotification('Error in sending command');
            // setStudentSelectedDevices([]);
        }
    }, [data, isSuccess, isError]);




    return (
        <>
            {/* Page Header */}
            <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-8 bg-primary rounded-full" />
                <div>
                    <h1 className="text-sm font-bold text-dark leading-tight">Device Configuration</h1>
                    <p className="text-error text-gray-500 mt-0.5">Select a division, choose a command, and send to devices</p>
                </div>
            </div>

            {/* Broadcast-to-connected utility (collapsed by default) — role-gated */}
            {canBroadcast && (
            <Accordion allowToggle mb={4}>
                <AccordionItem border="none">
                    <AccordionButton
                        bg="teal.50"
                        _hover={{ bg: "teal.100" }}
                        borderRadius="lg"
                        px={4}
                    >
                        <Box as="span" flex="1" textAlign="left" fontWeight="semibold" fontSize="sm">
                            Broadcast Command to Connected Devices (all divisions)
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel px={0} pt={3}>
                        <BroadcastConnectedCommand />
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
            )}

            <form>
                {/* Selection Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-3">
                    <div className="flex gap-4">
                        <ParentSearchSelect />
                        <ConfigCommandSearchSelect />
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                        <SelectedCommand />
                    </div>
                </div>

                {/* Device Panel */}
                <div className="mb-3">
                    <StudentDevicesPanel />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                    <Button name="Clear" success={false} isLoading={null} onHandleSubmit={onCancelSubmit} />
                    <Button name="Send Command" success={true} isLoading={isPending} onHandleSubmit={onHandleSubmit} />
                </div>
            </form>

            {/* Command History */}
            <div className="mt-6">
                <ConfigurationDataTable />
            </div>
            <CustomCommandModal />
        </>
    )
}




export default DeviceConfiguration;