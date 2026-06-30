import { useState } from "react";
import DivisionLogin from "./components/DivisionLogins/DivisionLogin";
import { useGetStudentDeviceDetailQuery } from "../../../api/queries/app/hooks/student-device-detail-api-hooks";
import { DataTableColumnInterface } from "../../../interfaces/AppInterfaces/DataTable/DataTableColumnInterface";
import { IAllDivisionDeviceInterface } from "../../../interfaces/AppInterfaces/AllDivisionDevices/AllDivisionDeviceInterface";
import DataTable from "../../../global/components/DataTable/DataTable";
import { Button, useDisclosure } from "@chakra-ui/react";
import { IconsStore } from "../../../global/Icons/IconsStore";
import RenewDeviceModal from "./components/RenewDeviceWise/RenewDeviceModal";
import RenewDivisionModal from "./components/RenewDivisionWise/RenewDivisionModal";
import { useErrorNotification } from "../../../utils/hooks/notification/useErrorNotification";
// import { DataTableContext } from "../../../contexts/AppLayout/DataTableContext/DataTableContext";

const DeviceSubscription = () => {
  const [parentId, setParentId] = useState<string>("");
  const [deviceID, setDeviceID] = useState<string>("");
  const { data, isFetching } = useGetStudentDeviceDetailQuery(parentId);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDivisionOpen,
    onOpen: onDivisionOpen,
    onClose: onDivisionClose,
  } = useDisclosure();

  // const {tableInstance} = useContext(DataTableContext);

  const handleRenewDevice = (deviceId: string) => {
    setDeviceID(deviceId);
    onOpen();
  };

  const handleDivisionModal = () => {
    if (parentId === "") {
      useErrorNotification("Please select a parent");
    } else {
      onDivisionOpen();
    }
  };



  const columns: DataTableColumnInterface<IAllDivisionDeviceInterface>[] = [
    {
      accessorKey:"deviceNo",
      header:"Device No",
      cell:(props)=> <span className="px-4">{props.getValue()}</span>,
      meta:{
        filterVariant:"range"
      }
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: (props) => <>{props.getValue()}</>,
    },
    {
      accessorKey: "imeiNo",
      header: "Imei No",
      cell: (props) => <>{props.getValue()}</>,
    },
    {
      accessorKey: "simNo",
      header: "Sim No",
      cell: (props) => <>{props.getValue()}</>,
    },
    {
      accessorKey: "deviceUsertype",
      header: "User Type",
      cell: (props) => <>{props.getValue()}</>,
    },
    {
      accessorKey: "validDay",
      header: "Valid Till",
      cell: (props) => (
        <span>
          {props.getValue() < 0 ? "Expired" : props.getValue() + " days"}
        </span>
      ),
    },
    {
      accessorKey: "deviceId",
      header: "Action",
      cell: (props) => (
        <>
          {
            <Button
              onClick={() => handleRenewDevice(props.getValue())}
              className="!bg-sky-600"
            >
              {IconsStore.rechargeIcon}
            </Button>
          }
        </>
      ),
    },
  ];

  return (
    <>
      <div className="px-2">
        <DivisionLogin setParentId={setParentId} />
        <div className="py-4">
          <DataTable
            additionalHeader={true}
            additionHeaderComponent={[
              <Button
                className="!bg-dark !text-white"
                onClick={() => handleDivisionModal()}
              >
                Renew Bulk
              </Button>,
            ]}
            columns={columns}
            data={data?.data?.data?.result}
            isLoading={isFetching}
            headerClassName="font-semibold py-1"
            bodyClassName="py-2 px-1 text-left font-medium border-b-2 border-b-gray-700"
            tableHeadCss="border-2 text-left border-gray-600 bg-dark text-white"
            tableCss="border-2 border-gray-700"
            headerFilter={true}
          />
        </div>
      </div>

      {isOpen && (
        <RenewDeviceModal
          isOpen={isOpen}
          onClose={onClose}
          deviceId={deviceID}
          data={data ? data.data.data.result : []}
        />
      )}
      {isDivisionOpen && parentId && (
        <RenewDivisionModal
          isOpen={isDivisionOpen}
          onClose={onDivisionClose}
          parentId={parentId}
        />
      )}
    </>
  );
};

export default DeviceSubscription;
