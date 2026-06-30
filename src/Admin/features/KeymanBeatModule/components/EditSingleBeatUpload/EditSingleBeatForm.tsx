import { useContext, useEffect } from "react";
import { KeyManFileUploadContext } from "../../../../../contexts/AppLayout/Admin/KeymanBeatContext/KeyManFileUploadContext/KeyManFileUploadContext";
import { ErrorMessage, Field, Form, Formik, FormikProps } from "formik";
import { IKeymanFormikEditInterface } from "../../../../../interfaces/AppInterfaces/KeyManBeatInterface/IKeyManRequestInterface";
import { convertSecondsToTime } from "../../services/convertSecondsToTime";
import { UserDetailContext } from "../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import { Button } from "@chakra-ui/react";
import { useKeymanSingleBeatUpdate } from "../../../../../api/queries/app/hooks/keyman-single-beat-update-api";
import { beatSingleUpdateValidation } from "../../hooks/BeatSingleUpdateValidation";
import { useSuccessNotification } from "../../../../../utils/hooks/notification/useSuccessNotification";
import { useQueryClient } from "@tanstack/react-query";
import { device_keyman_imei_beat_query } from "../../../../../api/queries/app/queryKeys/queryKeys";
import shiftType from "../../data/shiftType.json"
import { DeviceTypeContext } from "../../../../../contexts/AppLayout/Admin/DeviceTypeContext/DeviceTypeContext";

interface EditSingleBeatFormProps {
  beatId: string;
  onCloseModal: () => void;
}

const EditSingleBeatForm: React.FC<EditSingleBeatFormProps> = ({
  beatId,
  onCloseModal,
}) => {
  const { beatModuleDetailData, parentDivisionId, keymanBeatDetailRequest } =
    useContext(KeyManFileUploadContext);
  const { userDetail } = useContext(UserDetailContext);
  const { mutate, isSuccess } = useKeymanSingleBeatUpdate();
  const { deviceType } = useContext(DeviceTypeContext);



  const editData = beatModuleDetailData.filter((x) => x.beatId === beatId);
  const queryClient = useQueryClient();

  const initialDeviceTypeId: string = String(deviceType?.data.result.find((type) => type.deviceTypeId == editData[0].deviceTypeId)?.deviceTypeId ?? "");

  useEffect(() => {
    if (isSuccess) {
      useSuccessNotification("Beat updated successfully");
      queryClient.invalidateQueries({
        queryKey: [device_keyman_imei_beat_query, keymanBeatDetailRequest],
      });
      onCloseModal();
    }
  }, [isSuccess]);

  return (
    <>
      <Formik
        onSubmit={(values, action) => {
          setTimeout(() => {
            mutate({
              sectionName: values.sectionName,
              beatId: values.beatId,
              activeStatus: values.activeStatus,
              startTime: values.startTime,
              endTime: values.endTime,
              deviceImei: values.deviceImei,
              deviceTypeId: values.deviceTypeId,
              shiftType: values.shiftType,
              deviceNo: values.deviceNo,
              tstartKm: values.tstartKm,
              tendKm: values.tendKm,
              bendTime: values.bendTime,
              bstartTime: values.bstartTime,
              updatedBy: userDetail.data.result.divisionId,
              updatedAt: `${Math.floor(new Date().getTime() / 1000)}`,
              tripNo: values.tripNo,
              deviceName: values.deviceName,
              divisionId: parentDivisionId,
              isMultipleBeatPath: values.isMultipleBeatPath,
              reportEnable: values.reportEnable
            });
            action.setSubmitting(false);
          }, 700);
        }}
        initialValues={{
          sectionName: editData[0].sectionName,
          beatId: editData[0].beatId,
          activeStatus: editData[0].activeStatus,
          startTime: convertSecondsToTime(editData[0].startTime),
          endTime: convertSecondsToTime(editData[0].endTime),
          deviceImei: editData[0].deviceImei,
          deviceTypeId: initialDeviceTypeId,
          shiftType: editData[0].shiftType,
          deviceNo: editData[0].deviceNo,
          tstartKm: editData[0].tstartKm,
          tendKm: editData[0].tendKm,
          bendTime: convertSecondsToTime(editData[0].bendTime),
          bstartTime: convertSecondsToTime(editData[0].bstartTime),
          updatedBy: userDetail.data.result.divisionId,
          updatedAt: `${new Date().getTime() / 1000}`,
          tripNo: editData[0].tripNo,
          deviceName: editData[0].deviceName,
          divisionId: parentDivisionId,
          isMultipleBeatPath: true,
          reportEnable: editData[0].reportEnable
        }}
        validationSchema={beatSingleUpdateValidation}
      >
        {({ values }: FormikProps<IKeymanFormikEditInterface>) => (
          <Form>
            <div className="flex justify-between gap-2">
              <div className="flex flex-col w-full">
                <label htmlFor="sectionName" className="font-semibold">
                  Section Name
                </label>
                <Field
                  name="sectionName"
                  type="text"
                  id="sectionName"
                  value={values.sectionName}
                  className="border-2 px-2 py-1 rounded border-gray-400 focus:border-black"
                />
                <ErrorMessage
                  name="sectionName"
                  component={"div"}
                  className="text-red-500 text-xss"
                />
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="deviceName" className="font-semibold">
                  Device Name
                </label>
                <Field
                  name="deviceName"
                  type="text"
                  id="deviceName"
                  value={values.deviceName}
                  className="border-2 px-2 py-1 rounded border-gray-400 focus:border-black"
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
                  value={values.endTime}
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
                  value={values.bstartTime}
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
                  value={values.bendTime}
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
                  Trip Start Km
                </label>
                <Field
                  type="number"
                  name="tstartKm"
                  id="tstartKm"
                  value={values.tstartKm}
                  className="border-2 w-full py-1 px-2 outline-none rounded border-gray-300 focus:border-black"
                />
                <ErrorMessage
                  name="tstartKm"
                  component={"div"}
                  className="text-red-500 text-xss"
                />
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="tendKm" className="font-semibold">
                  Trip End Km
                </label>
                <Field
                  type="number"
                  name="tendKm"
                  id="tendKm"
                  value={values.tendKm}
                  className="border-2 w-full py-1 px-2 outline-none rounded border-gray-300 focus:border-black"
                />
                <ErrorMessage
                  name="tendKm"
                  component={"div"}
                  className="text-red-500 text-xss"
                />
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <div className="flex flex-col w-full">
                <label htmlFor="tripNo" className="font-semibold">
                  Trip No
                </label>
                <Field
                  type="number"
                  name="tripNo"
                  id="tripNo"
                  value={values.tripNo}
                  className="border-2 w-full py-1 px-2 outline-none rounded border-gray-300 focus:border-black"
                />
                <ErrorMessage
                  name="tripNo"
                  component={"div"}
                  className="text-red-500 text-xss"
                />
              </div>
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
                  <option value="">Select Device Type</option>
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
            </div>
            <div className="flex justify-between gap-2">
              <div className="flex flex-col w-full">
                <label htmlFor="shiftType" className="font-semibold">
                  Select Device Type
                </label>
                <Field
                  as="select"
                  name="shiftType"
                  id="shiftType"
                  className="border-2 border-gray-400 focus:border-black px-2 py-1 rounded"
                >
                  <option value="">Select Device Type</option>
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
            </div>

            <div className="mt-3 flex justify-end gap-4">
              <Button type="submit" colorScheme="green">
                Submit
              </Button>
              <Button type="button" onClick={onCloseModal} colorScheme="red">
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default EditSingleBeatForm;
