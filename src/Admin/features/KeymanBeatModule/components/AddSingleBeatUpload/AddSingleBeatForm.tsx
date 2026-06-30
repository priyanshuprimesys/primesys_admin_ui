import { ErrorMessage, Field, Form, Formik, FormikProps } from "formik";
import { IKeyManFormikRequestInterface } from "../../../../../interfaces/AppInterfaces/KeyManBeatInterface/IKeyManRequestInterface";
import { useContext, useEffect, useState } from "react";
import { KeyManFileUploadContext } from "../../../../../contexts/AppLayout/Admin/KeymanBeatContext/KeyManFileUploadContext/KeyManFileUploadContext";
import { UserDetailContext } from "../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import { Button } from "@chakra-ui/react";
import { beatSingleUploadValidation } from "../../hooks/BeatSingleUploadValidation";
import { postKeymanSingleBeat } from "../../../../../api/queries/app/hooks/keyman-single-beat-upload-api";
import { useSuccessNotification } from "../../../../../utils/hooks/notification/useSuccessNotification";
import { useErrorNotification } from "../../../../../utils/hooks/notification/useErrorNotification";
import { useQueryClient } from "@tanstack/react-query";
import { device_keyman_imei_beat_query } from "../../../../../api/queries/app/queryKeys/queryKeys";
import shiftType from "../../data/shiftType.json";
import { DeviceTypeContext } from "../../../../../contexts/AppLayout/Admin/DeviceTypeContext/DeviceTypeContext";

interface AddSingleBeatProps {
  onCloseModal: () => void;
}

const AddSingleBeatForm: React.FC<AddSingleBeatProps> = ({ onCloseModal }) => {
  const {
    studentDeviceImei,
    parentDivisionId,
    studentDeviceNo,
    studentDeviceTypeName,
    keymanBeatDetailRequest,
  } = useContext(KeyManFileUploadContext);
  const { userDetail } = useContext(UserDetailContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { deviceType } = useContext(DeviceTypeContext);

  const queryClient = useQueryClient();

  const { mutate, isSuccess, isError } = postKeymanSingleBeat();

  useEffect(() => {
    if (isSuccess) {
      useSuccessNotification("Beat uploaded successfully");
      onCloseModal();
      queryClient.invalidateQueries({
        queryKey: [device_keyman_imei_beat_query, keymanBeatDetailRequest],
      });
      return;
    } else if (isError) {
      useErrorNotification("Error in beat upload");
      return;
    }
  }, [isError, isSuccess]);

  console.log("Device Type", deviceType?.data.result);

  return (
    <Formik
      onSubmit={(values, action) => {
        setIsLoading(true);
        mutate({
          deviceImei: values.deviceImei,
          divisionId: values.divisionId,
          deviceName: values.deviceName,
          deviceNo: values.deviceNo,
          updatedBy: values.updatedBy,
          updatedAt: values.updatedAt,
          sectionName: values.sectionName,
          beatId: values.beatId,
          activeStatus: true,
          startTime: values.startTime,
          endTime: values.endTime,
          bstartTime: values.bstartTime,
          bendTime: values.bendTime,
          tstartKm: values.tstartKm,
          tendKm: values.tendKm,
          deviceTypeId: values.deviceTypeId,
          isMultipleBeatPath: values.isMultipleBeatPath,
          tripNo: values.tripNo,
          sendAutoPeriodCommand: values.sendAutoPeriodCommand,
          shiftType: values.shiftType,
          reportEnable: values.reportEnable
        });
        setTimeout(() => {
          action.setSubmitting(false);

          setIsLoading(false);
        }, 1200);
      }}
      initialValues={{
        deviceImei: studentDeviceImei,
        divisionId: parentDivisionId,
        deviceName: studentDeviceTypeName,
        deviceNo: `${studentDeviceNo}`,
        updatedBy: userDetail.data.result.divisionId,
        updatedAt: `${Math.floor(new Date().getTime() / 1000)}`,
        sectionName: "NA",
        beatId: "",
        activeStatus: true,
        startTime: "00:00",
        endTime: "00:00",
        bstartTime: "00:00",
        bendTime: "00:00",
        tstartKm: "",
        tendKm: "",
        deviceTypeId: "",
        isMultipleBeatPath: false,
        tripNo: "",
        sendAutoPeriodCommand: false,
        shiftType: 0,
        reportEnable: false
      }}
      validationSchema={beatSingleUploadValidation}
    >
      {({
        values,
        setFieldValue,
      }: FormikProps<IKeyManFormikRequestInterface>) => (
        <Form>
          <div>
            <div className="flex flex-col w-full">
              <label htmlFor="deviceName" className="font-semibold">
                Device name
              </label>
              <Field
                type="text"
                name="deviceName"
                id="deviceName"
                className="border-2 border-gray-400 focus:border-black px-2 py-1 rounded"
              />
              <ErrorMessage
                name="deviceName"
                component={"div"}
                className="text-red-500 text-xss"
              />
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex flex-col w-full">
              <div className="flex flex-col w-full">
                <label htmlFor="tripNo" className="font-semibold">
                  Trip No
                </label>
                <Field
                  placeholder="Enter Trip no"
                  type="number"
                  name="tripNo"
                  id="tripNo"
                  className="border-2 border-gray-400 focus:border-black px-2 py-1 rounded"
                />
                <ErrorMessage
                  name="tripNo"
                  component={"div"}
                  className="text-red-500 text-xss"
                />
              </div>
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="sectionName" className="font-semibold">
                Section name
              </label>
              <Field
                placeholder="Enter section name"
                type="text"
                name="sectionName"
                id="sectionName"
                className="border-2 border-gray-400 focus:border-black px-2 py-1 rounded"
              />
              <ErrorMessage
                name="sectionName"
                component={"div"}
                className="text-red-500 text-xss"
              />
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <div className="flex flex-col w-full">
              <label htmlFor="startTime" className="font-semibold">
                Start Time
              </label>
              <Field
                type="time"
                name="startTime"
                id="startTime"
                value={values.startTime}
                className="border-2 w-full py-1 px-2 outline-none rounded border-gray-300 focus:border-black"
              />
              <ErrorMessage
                name="startTime"
                component={"div"}
                className="text-red-500 text-xss"
              />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="endTime" className="font-semibold">
                End Time
              </label>
              <Field
                type="time"
                name="endTime"
                id="endTime"
                className="border-2 w-full py-1 px-2 outline-none rounded border-gray-300 focus:border-black"
              />
              <ErrorMessage
                name="endTime"
                component={"div"}
                className="text-red-500 text-xss"
              />
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <div className="flex flex-col w-full">
              <label htmlFor="bstartTime" className="font-semibold">
                Break Start Time
              </label>
              <Field
                type="time"
                name="bstartTime"
                id="bstartTime"
                className="border-2 w-full py-1 px-2 outline-none rounded border-gray-300 focus:border-black"
              />
              <ErrorMessage
                name="bstartTime"
                component={"div"}
                className="text-red-500 text-xss"
              />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="bendTime" className="font-semibold">
                Break End Time
              </label>
              <Field
                type="time"
                name="bendTime"
                id="bendTime"
                className="border-2 w-full py-1 px-2 outline-none rounded border-gray-300 focus:border-black"
              />
              <ErrorMessage
                name="bendTime"
                component={"div"}
                className="text-red-500 text-xss"
              />
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <div className="flex flex-col w-full">
              <label htmlFor="tstartKm" className="font-semibold">
                Trip Start km
              </label>
              <Field
                placeholder="Enter start km"
                type="number"
                name="tstartKm"
                id="tstartKm"
                className="border-2 border-gray-400 focus:border-black px-2 py-1 rounded"
              />
              <ErrorMessage
                name="tstartKm"
                component={"div"}
                className="text-red-500 text-xss"
              />
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="tendKm" className="font-semibold">
                Trip End km
              </label>
              <Field
                placeholder="Enter end km"
                type="number"
                name="tendKm"
                id="tendKm"
                className="border-2 border-gray-400 focus:border-black px-2 py-1 rounded"
              />
              <ErrorMessage
                name="tendKm"
                component={"div"}
                className="text-red-500 text-xss"
              />
            </div>
          </div>

          <div className="flex justify-between gap-2 mt-2">
            <div className="flex flex-col w-full">
              <label htmlFor="deviceTypeId" className="font-semibold">
                Select Device Type
              </label>
              <Field
                as="select"
                name="deviceTypeId"
                id="deviceTypeId"
                className="border-2 border-gray-400 focus:border-black px-2 py-1 rounded"
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
              <ErrorMessage
                name="deviceTypeId"
                component={"div"}
                className="text-red-500 text-xss"
              />
            </div>
            <div className="flex items-center gap-2 px-4  w-full">
              <Field
                type="checkbox"
                name="isMultipleBeatPath"
                checked={values.isMultipleBeatPath}
                onChange={(e: { target: { checked: any } }) => {
                  setFieldValue("isMultipleBeatPath", e.target.checked);
                }}
              />
              <label htmlFor="isMultipleBeatPath" className="font-semibold">
                Is Multiple Beat
              </label>
            </div>
          </div>
          <div className="flex justify-between gap-2 mt-2">
            <div className="flex flex-col w-full">
              <label htmlFor="shiftType" className="font-semibold">
                Select Shift Type
              </label>
              <Field
                as="select"
                name="shiftType"
                id="shiftType"
                className="border-2 border-gray-400 focus:border-black px-2 py-1 rounded"
              >
                <option value="">Select Shift type</option>
                {shiftType.map((item, index) => (
                  <option key={index} value={item.shift}>
                    {item.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="shiftType"
                component={"div"}
                className="text-red-500 text-xss"
              />
            </div>
            <div className="flex items-center gap-2 px-4  w-full">
              <Field
                type="checkbox"
                name="reportEnable"
                checked={values.reportEnable}
                onChange={(e: { target: { checked: any } }) => {
                  setFieldValue("reportEnable", e.target.checked);
                }}
              />
              <label htmlFor="reportEnable" className="font-semibold">
                Report Enabled
              </label>
            </div>
          </div>

          <div className="mt-4 ">
            <div className="flex gap-2">
              <Field
                type="checkbox"
                name="sendAutoPeriodCommand"
                checked={values.sendAutoPeriodCommand}
                onChange={(e: { target: { checked: any } }) => {
                  setFieldValue("sendAutoPeriodCommand", e.target.checked);
                }}
              />
              <label htmlFor="sendAutoPeriodCommand" className="font-semibold">
                Send AutoPeriod Command
              </label>
            </div>

            <span className="text-red-600 text-xss">Check only if you want to send auto command</span>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <Button
              disabled={isLoading}
              type="submit"
              name="Submit"
              colorScheme="green"
            >
              {isLoading ? "Submitting" : "Submit"}
            </Button>
            <Button
              type="button"
              onClick={onCloseModal}
              name="Cancel"
              colorScheme="red"
            >
              Cancel
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddSingleBeatForm;
