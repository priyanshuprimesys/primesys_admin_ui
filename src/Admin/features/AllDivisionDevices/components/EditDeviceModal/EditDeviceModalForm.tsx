import { Field, Form, Formik, FormikProps } from "formik";
// import DeviceType from "../../data/deviceTypeID.json";
import { Button } from "@chakra-ui/react";
import { IUpdateDivisionDevicesInterface } from "../../../../../interfaces/AppInterfaces/AllDivisionDevices/UpdateDivisionDevicesInterface";
import { simType, deviceVersionType } from '../../data/deviceOptions';
import CustomFormikDatePicker from "../../../../../global/components/input/CustomInputBox/CustomFormikDatePicker";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { UserDetailContext } from "../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import { getTimeStampToDate } from "../../../../../utils/hooks/timeStampToDate/getTimeStampToDate";
import { updateDivisionDevice } from "../../../../../api/queries/app/hooks/division-update-device-api-hooks";
import { dateToTimestamp } from "../../../../../utils/hooks/dateToTimestamp/dateToTimestamp";
import { useSuccessNotification } from "../../../../../utils/hooks/notification/useSuccessNotification";
import { useQueryClient } from "@tanstack/react-query";
import { admin_division_id_device_query } from "../../../../../api/queries/app/queryKeys/queryKeys";
import ShiftType from "../../data/shiftType.json";
import { Switch } from '@chakra-ui/react'
import { DeviceTypeContext } from "../../../../../contexts/AppLayout/Admin/DeviceTypeContext/DeviceTypeContext";

interface EditDeviceProps {
  data: any[];
  deviceId: string;
  onHandleClose: () => void;
}

const EditDeviceModalForm: React.FC<EditDeviceProps> = ({
  data,
  deviceId,
  onHandleClose,
}) => {
  const editData = data.filter((x) => x.id === deviceId);

  const { mutate, data: updateData } = updateDivisionDevice();
  const [activeStatus, setAciveStatus] = useState<boolean>(editData[0].active_status);
  const { deviceType } = useContext(DeviceTypeContext);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (updateData?.data.success === true) {
      useSuccessNotification("Device Updated");
      queryClient.invalidateQueries({
        queryKey: [admin_division_id_device_query],
      });
      onHandleClose();
    }
  }, [updateData]);

  const { userDetail } = useContext(UserDetailContext);

  const handleStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setAciveStatus(checked);
  }


  return (
    <Formik
      onSubmit={(values, action) => {
        mutate({
          id: values.id,
          deviceImei: values.deviceImei, //done
          divisionId: values.divisionId, // predefined value ig
          deviceName: values.deviceName, //done
          deviceNo: values.deviceNo, //done
          deviceSimNo: values.deviceSimNo, //done
          deviceSimImeiNo: values.deviceSimImeiNo,
          showGoogleAddress: values.showGoogleAddress,
          reportAsIndependentRdps: values.reportAsIndependentRdps,
          deviceTypeId: values.deviceTypeId, // default value ig
          reportTimeMargin: values.reportTimeMargin,
          onTrackMargin: values.onTrackMargin,
          reportDistMargin: values.reportDistMargin,
          activationDate: dateToTimestamp(values.activationDate),
          deviceUserType: values.deviceUserType,
          tripWiseReport: values.tripWiseReport,
          simServiceProvider: values.simServiceProvider,
          updatedBy: userDetail.data.result.divisionId,
          shiftType: values.shiftType,
          reportEnable: values.reportEnable,
          activeStatus: activeStatus,
          deviceVersion: values.deviceVersion
        });
        setTimeout(() => {
          action.setSubmitting(false);
        }, 700);
      }}
      initialValues={{
        id: editData[0].id,
        deviceImei: editData[0].deviceImei,
        divisionId: editData[0].divisionId,
        deviceName: editData[0].deviceName,
        deviceNo: editData[0].deviceNo,
        deviceSimNo: editData[0].deviceSimNo,
        deviceSimImeiNo: editData[0].deviceSimImeiNo,
        showGoogleAddress: editData[0].showGoogleAddress,
        reportAsIndependentRdps: editData[0].reportAsIndependentRdps,
        deviceTypeId: editData[0].deviceTypeId,
        reportTimeMargin: editData[0].reportTimeMargin,
        onTrackMargin: editData[0].onTrackMargin,
        reportDistMargin: editData[0].reportDistMargin,
        activationDate: getTimeStampToDate(editData[0].activationDate),
        deviceUserType: editData[0].deviceUserType,
        tripWiseReport: editData[0].tripWiseReport,
        simServiceProvider:
          simType.find(
            (s) =>
              s.toLowerCase() ===
              String(editData[0].simServiceProvider ?? "").toLowerCase()
          ) ?? editData[0].simServiceProvider ?? "",
        updatedBy: userDetail.data.result.divisionId,
        shiftType: editData[0].shiftType,
        reportEnable: editData[0].reportEnable,
        activeStatus: activeStatus,
        deviceVersion:
          deviceVersionType.find(
            (v) =>
              v.toLowerCase() ===
              String(editData[0].deviceVersion ?? "").toLowerCase()
          ) ?? editData[0].deviceVersion ?? ""
      }}
    >
      {({ values }: FormikProps<IUpdateDivisionDevicesInterface>) => (
        <Form>
          <div className="mb-2">
            <p className="m-0 text-red-500">{updateData && updateData?.data?.error?.message}</p>
          </div>
          <div className="flex items-center justify-end gap-5 py-2">
            <h1 className="font-semibold">Active Status</h1>
            <Switch onChange={handleStatus} isChecked={activeStatus} />
          </div>
          <div className="flex w-full gap-2">
            <div className="flex flex-col w-full">
              <label htmlFor="deviceName" className="text-xs font-semibold">
                Device Name
              </label>
              <Field
                type="text"
                name="deviceName"
                id="deviceName"
                placeholder="Enter Device Name"
                className="w-full px-1 py-2 border-2 border-gray-400 rounded outline-none focus:border-black"
              />
              {/* <ErrorMessage
                component={"div"}
                name="deviceName"
                className="text-red-700 text-xss"
              /> */}
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="deviceImei" className="text-xs font-semibold">
                Device Imei
              </label>
              <Field
                type="number"
                name="deviceImei"
                id="deviceImei"
                placeholder="Enter Device Imei"
                className="w-full px-1 py-2 border-2 border-gray-400 rounded outline-none focus:border-black"
              />
              {/* <ErrorMessage
                component={"div"}
                name="deviceImei"
                className="text-red-700 text-xss"
              /> */}
            </div>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <div className="flex flex-col w-full">
              <label htmlFor="deviceNo" className="text-xs font-semibold">
                Device Number
              </label>
              <Field
                type="number"
                name="deviceNo"
                id="deviceNo"
                placeholder="Enter Device Number"
                readOnly
                disabled
                className="w-full px-1 py-2 border-2 border-gray-400 rounded outline-none bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              {/* <ErrorMessage
                component={"div"}
                name="deviceNo"
                className="text-red-700 text-xss"
              /> */}
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="deviceSimNo" className="text-xs font-semibold">
                Device Sim No
              </label>
              <Field
                type="text"
                name="deviceSimNo"
                id="deviceSimNo"
                placeholder="Enter Device Sim No"
                className="w-full px-1 py-2 border-2 border-gray-400 rounded outline-none focus:border-black"
              />
              {/* <ErrorMessage
                component={"div"}
                name="deviceSimNo"
                className="text-red-700 text-xss"
              /> */}
            </div>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <div className="flex flex-col w-full">
              <label
                htmlFor="reportTimeMargin"
                className="text-xs font-semibold"
              >
                Time Margin for Report
              </label>
              <Field
                type="number"
                name="reportTimeMargin"
                id="reportTimeMargin"
                placeholder="Enter time margin for report"
                className="w-full px-1 py-2 border-2 border-gray-400 rounded outline-none focus:border-black"
              />
              {/* <ErrorMessage
                component={"div"}
                name="reportTimeMargin"
                className="text-red-700 text-xss"
              /> */}
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="onTrackMargin" className="text-xs font-semibold">
                Nearest Distance for Rdps
              </label>
              <Field
                type="text"
                name="onTrackMargin"
                id="onTrackMargin"
                placeholder="Enter nearest distance for Rdps"
                className="w-full px-1 py-2 border-2 border-gray-400 rounded outline-none focus:border-black"
              />
              {/* <ErrorMessage
                component={"div"}
                name="onTrackMargin"
                className="text-red-700 text-xss"
              /> */}
            </div>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <div className="flex flex-col w-full">
              <label
                htmlFor="reportDistMargin"
                className="text-xs font-semibold"
              >
                Distance Margin for Report
              </label>
              <Field
                type="number"
                name="reportDistMargin"
                id="reportDistMargin"
                placeholder="Enter time margin for report"
                className="w-full px-1 py-2 border-2 border-gray-400 rounded outline-none focus:border-black"
              />
              {/* <ErrorMessage
                component={"div"}
                name="reportDistMargin"
                className="text-red-700 text-xss"
              /> */}
            </div>
            <div className="flex flex-col w-full">
              <label
                htmlFor="simServiceProvider"
                className="text-xs font-semibold"
              >
                Select Sim Service Provider
              </label>
              <Field
                as="select"
                name="simServiceProvider"
                id="simServiceProvider"
                className="w-full px-1 py-2 border-2 border-gray-400 rounded outline-none focus:border-black"
              >
                <option value="">Select Sim service</option>
                {simType.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </Field>
              {/* <ErrorMessage
                component={"div"}
                name="simServiceProvider"
                className="text-red-700 text-xss"
              /> */}
            </div>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <div className="flex flex-col w-full">
              <label htmlFor="activationDate" className="text-xs font-semibold">
                Report Activation Date
              </label>
              <CustomFormikDatePicker
                placeholder="Enter Activation Date"
                name="activationDate"
              />
              {/* <ErrorMessage
                component={"div"}
                name="activationDate"
                className="text-red-700 text-xss"
              /> */}
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="deviceUserType" className="text-xs font-semibold">
                Select Device User Type
              </label>
              <Field
                as="select"
                name="deviceUserType"
                id="deviceUserType"
                className="w-full px-1 py-2 border-2 border-gray-400 rounded outline-none focus:border-black"
              >
                <option value="">Select user type</option>
                <option value="person">Person</option>
                <option value="car">Car</option>
              </Field>
              {/* <ErrorMessage
                component={"div"}
                name="deviceUserType"
                className="text-red-700 text-xss"
              /> */}
            </div>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <div className="flex flex-col w-full">
              <label
                htmlFor="deviceSimImeiNo"
                className="text-xs font-semibold"
              >
                Distance Sim Imei No
              </label>
              <Field
                type="text"
                name="deviceSimImeiNo"
                id="deviceSimImeiNo"
                placeholder="Enter device sim imei no"
                className="w-full px-1 py-2 border-2 border-gray-400 rounded outline-none focus:border-black"
              />
              {/* <ErrorMessage
                component={"div"}
                name="deviceSimImeiNo"
                className="text-red-700 text-xss"
              /> */}
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="deviceTypeId" className="text-xs font-semibold">
                Select Device Type
              </label>
              <Field
                as="select"
                name="deviceTypeId"
                id="deviceTypeId"
                className="w-full px-1 py-2 border-2 border-gray-400 rounded outline-none focus:border-black"
              >
                <option value="">Select device type</option>
                {
                  deviceType?.data.result.map((item, index) => (
                    <option key={index} value={item.deviceTypeId}>
                      {item.deviceType}
                    </option>
                  ))
                }
              </Field>
              {/* <ErrorMessage
                component={"div"}
                name="deviceTypeId"
                className="text-red-700 text-xss"
              /> */}
            </div>
          </div>
          <div className="flex w-full gap-2 mt-3">
            <div className="flex flex-col w-full">
              <label
                htmlFor="showGoogleAddress"
                className="text-xs font-semibold"
              >
                Show Google Address
              </label>
              <div className="flex items-center gap-2">
                <Field type="checkbox" name="showGoogleAddress" />
                <span className="font-semibold">{`${values.showGoogleAddress}`}</span>
              </div>
              {/* <ErrorMessage
                component={"div"}
                name="showGoogleAddress"
                className="text-red-700 text-xss"
              /> */}
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="tripWiseReport" className="text-xs font-semibold">
                Trip Wise Report Generate
              </label>
              <div className="flex items-center gap-2">
                <Field type="checkbox" name="tripWiseReport" />
                <span className="font-semibold">{`${values.tripWiseReport}`}</span>
              </div>
            </div>
          </div>

          <div className="flex w-full gap-3 mt-3">
            <div className="flex flex-col w-full">
              <label htmlFor="shiftType" className="text-xs font-semibold">
                Select Shift Type
              </label>
              <Field
                as="select"
                name="shiftType"
                id="shiftType"
                className="w-full px-1 py-2 border-2 border-gray-400 rounded outline-none focus:border-black"
              >
                <option value="">Select shift type</option>
                {ShiftType.map((item, index) => (
                  <option key={index} value={item.shift}>
                    {item.name}
                  </option>
                ))}
              </Field>
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="reportEnable" className="text-xs font-semibold">
                Report Enabled
              </label>
              <div className="flex items-center gap-2">
                <Field type="checkbox" name="reportEnable" />
                <span className="font-semibold">{`${values.reportEnable}`}</span>
              </div>
            </div>

          </div>

          <div className="flex w-full gap-2 mt-3">
            <div className="flex flex-col w-full">
              <label htmlFor="deviceVersion" className="text-xs font-semibold">
                Select Device Version
              </label>
              <Field
                as="select"
                name="deviceVersion"
                id="deviceVersion"
                className="w-full px-1 py-2 border-2 border-gray-400 rounded outline-none focus:border-black"
              >
                <option value="">Select device version</option>
                {deviceVersionType.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </Field>
            </div>
            <div className="flex flex-col w-full" />
          </div>

          <div className="flex justify-end gap-4 mt-3">
            <Button type="submit" colorScheme="green">
              Submit
            </Button>
            <Button onClick={onHandleClose} type="button" colorScheme="red">
              Cancel
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditDeviceModalForm;
