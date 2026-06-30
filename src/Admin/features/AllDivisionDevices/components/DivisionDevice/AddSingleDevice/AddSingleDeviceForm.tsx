import { ErrorMessage, Field, Form, Formik, FormikProps } from "formik";
import { IAddDivisionFormikDevicesInterface } from "../../../../../../interfaces/AppInterfaces/AllDivisionDevices/AddDivisionDevicesInterface";
import { Button, useDisclosure } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { UserDetailContext } from "../../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import CustomFormikDatePicker from "../../../../../../global/components/input/CustomInputBox/CustomFormikDatePicker";
import { AddDivisionSingleDeviceValidation } from "../../../hooks/AddDivisionSingleDeviceValidation";
import { postDivisionDevice } from "../../../../../../api/queries/app/hooks/division-save-device-api-hooks";
import { useSuccessNotification } from "../../../../../../utils/hooks/notification/useSuccessNotification";
import { useErrorNotification } from "../../../../../../utils/hooks/notification/useErrorNotification";
import { dateToTimestamp } from "../../../../../../utils/hooks/dateToTimestamp/dateToTimestamp";
import { useQueryClient } from "@tanstack/react-query";
import { admin_division_id_device_query } from "../../../../../../api/queries/app/queryKeys/queryKeys";
import DeviceType from "../../../data/deviceTypeID.json";
import ChakraUiModal from "../../../../../../global/components/Modals/components/ChakraUiModal";
import { GoDotFill } from "react-icons/go";
import shiftType from "../../../data/shiftType.json";
import { simType, deviceVersionType } from "../../../data/deviceOptions";

interface AddSingleDeviceFormInterface {
  parentID: string;
  onClose: () => void;
}

const AddSingleDeviceForm: React.FC<AddSingleDeviceFormInterface> = ({
  parentID,
  onClose,
}) => {
  const { userDetail } = useContext(UserDetailContext);

  const { mutate, data } = postDivisionDevice();

  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { onClose: onErrorClose, onOpen, isOpen } = useDisclosure();
  const [errors, setErrors] = useState<Array<any>>([]);

  useEffect(() => {
    if (data?.data.success === true) {
      useSuccessNotification("Device saved successfully");
      queryClient.invalidateQueries({
        queryKey: [admin_division_id_device_query],
      });
      onClose();
    } else if (data?.data.success === false) {
      setIsLoading(false);
      onOpen();
      const result = data.data.error.message
        .trim()
        .split("\n") // Split the input into lines
        .map((line) => {
          const match = line.match(/(\d+).*division id (\w+)/); // Extract device ID and division ID
          if (match) {
            const deviceId = match[1]; // First captured group
            const divisionId = match[2]; // Second captured group
            return `${deviceId} is associated with ${divisionId}`;
          }
          return null; // Return null for lines that don't match
        })
        .filter(Boolean);
      setErrors(result);
      useErrorNotification("Device is already associated with other division");
    }
  }, [data]);

  return (
    <>
      <Formik
        onSubmit={(values, action) => {
          setIsLoading(true);
          mutate({
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
            reportEnable:values.reportEnable,
            deviceVersion: values.deviceVersion
          });
          setTimeout(() => {
            action.setSubmitting(false);
          }, 900);
        }}
        validationSchema={AddDivisionSingleDeviceValidation}
        initialValues={{
          deviceImei: "", //done
          divisionId: parentID, // predefined value ig
          deviceName: "", //done
          deviceNo: "", //done
          deviceSimNo: "", //done
          deviceSimImeiNo: "",
          showGoogleAddress: false,
          reportAsIndependentRdps: false,
          deviceTypeId: 0, // default value ig
          reportTimeMargin: "1800",
          onTrackMargin: "100",
          reportDistMargin: "100",
          activationDate: "",
          deviceUserType: "",
          tripWiseReport: false,
          simServiceProvider: "",
          updatedBy: userDetail.data.result.divisionId, // predefined value ig
          shiftType:0,
          reportEnable:false,
          deviceVersion:""
        }}
      >
        {({ values }: FormikProps<IAddDivisionFormikDevicesInterface>) => (
          <Form>
            <div>
              <div className="flex w-full gap-2">
                <div className="flex flex-col w-full">
                  <label htmlFor="deviceName" className="font-semibold text-xs">
                    Device Name
                  </label>
                  <Field
                    type="text"
                    name="deviceName"
                    id="deviceName"
                    placeholder="Enter Device Name"
                    className="px-1 py-2 w-full rounded outline-none border-2 border-gray-400 focus:border-black"
                  />
                  <ErrorMessage
                    component={"div"}
                    name="deviceName"
                    className="text-xss text-red-700"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="deviceImei" className="font-semibold text-xs">
                    Device Imei
                  </label>
                  <Field
                    type="number"
                    name="deviceImei"
                    id="deviceImei"
                    placeholder="Enter Device Imei"
                    className="px-1 py-2 w-full rounded outline-none border-2 border-gray-400 focus:border-black"
                  />
                  <ErrorMessage
                    component={"div"}
                    name="deviceImei"
                    className="text-xss text-red-700"
                  />
                </div>
              </div>
              <div className="flex w-full gap-2 mt-3">
                <div className="flex flex-col w-full">
                  <label htmlFor="deviceNo" className="font-semibold text-xs">
                    Device Number
                  </label>
                  <Field
                    type="number"
                    name="deviceNo"
                    id="deviceNo"
                    placeholder="Enter Device Number"
                    className="px-1 py-2 w-full rounded outline-none border-2 border-gray-400 focus:border-black"
                  />
                  <ErrorMessage
                    component={"div"}
                    name="deviceNo"
                    className="text-xss text-red-700"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="deviceSimNo"
                    className="font-semibold text-xs"
                  >
                    Device Sim No
                  </label>
                  <Field
                    type="text"
                    name="deviceSimNo"
                    id="deviceSimNo"
                    placeholder="Enter Device Sim No"
                    className="px-1 py-2 w-full rounded outline-none border-2 border-gray-400 focus:border-black"
                  />
                  <ErrorMessage
                    component={"div"}
                    name="deviceSimNo"
                    className="text-xss text-red-700"
                  />
                </div>
              </div>
              <div className="flex w-full gap-2 mt-3">
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="reportTimeMargin"
                    className="font-semibold text-xs"
                  >
                    Time Margin for Report
                  </label>
                  <Field
                    type="number"
                    name="reportTimeMargin"
                    id="reportTimeMargin"
                    placeholder="Enter time margin for report"
                    className="px-1 py-2 w-full rounded outline-none border-2 border-gray-400 focus:border-black"
                  />
                  <ErrorMessage
                    component={"div"}
                    name="reportTimeMargin"
                    className="text-xss text-red-700"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="onTrackMargin"
                    className="font-semibold text-xs"
                  >
                    Nearest Distance for Rdps
                  </label>
                  <Field
                    type="text"
                    name="onTrackMargin"
                    id="onTrackMargin"
                    placeholder="Enter nearest distance for Rdps"
                    className="px-1 py-2 w-full rounded outline-none border-2 border-gray-400 focus:border-black"
                  />
                  <ErrorMessage
                    component={"div"}
                    name="onTrackMargin"
                    className="text-xss text-red-700"
                  />
                </div>
              </div>
              <div className="flex w-full gap-2 mt-3">
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="reportDistMargin"
                    className="font-semibold text-xs"
                  >
                    Distance Margin for Report
                  </label>
                  <Field
                    type="number"
                    name="reportDistMargin"
                    id="reportDistMargin"
                    placeholder="Enter time margin for report"
                    className="px-1 py-2 w-full rounded outline-none border-2 border-gray-400 focus:border-black"
                  />
                  <ErrorMessage
                    component={"div"}
                    name="reportDistMargin"
                    className="text-xss text-red-700"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="simServiceProvider"
                    className="font-semibold text-xs"
                  >
                    Select Sim Service Provider
                  </label>
                  <Field
                    as="select"
                    name="simServiceProvider"
                    id="simServiceProvider"
                    className="px-1 py-2 w-full rounded outline-none border-2 border-gray-400 focus:border-black"
                  >
                    <option value="">Select Sim service</option>
                    {simType.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    component={"div"}
                    name="simServiceProvider"
                    className="text-xss text-red-700"
                  />
                </div>
              </div>
              <div className="flex w-full gap-2 mt-3">
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="activationDate"
                    className="font-semibold text-xs"
                  >
                    Report Activation Date
                  </label>
                  <CustomFormikDatePicker
                    placeholder="Enter Activation Date"
                    name="activationDate"
                  />
                  <ErrorMessage
                    component={"div"}
                    name="activationDate"
                    className="text-xss text-red-700"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="deviceUserType"
                    className="font-semibold text-xs"
                  >
                    Select Device User Type
                  </label>
                  <Field
                    as="select"
                    name="deviceUserType"
                    id="deviceUserType"
                    className="px-1 py-2 w-full rounded outline-none border-2 border-gray-400 focus:border-black"
                  >
                    <option value="">Select user type</option>
                    <option value="person">Person</option>
                    <option value="car">Car</option>
                  </Field>
                  <ErrorMessage
                    component={"div"}
                    name="deviceUserType"
                    className="text-xss text-red-700"
                  />
                </div>
              </div>
              <div className="flex w-full gap-2 mt-3">
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="deviceSimImeiNo"
                    className="font-semibold text-xs"
                  >
                    Distance Sim Imei No
                  </label>
                  <Field
                    type="text"
                    name="deviceSimImeiNo"
                    id="deviceSimImeiNo"
                    placeholder="Enter device sim imei no"
                    className="px-1 py-2 w-full rounded outline-none border-2 border-gray-400 focus:border-black"
                  />
                  <ErrorMessage
                    component={"div"}
                    name="deviceSimImeiNo"
                    className="text-xss text-red-700"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="deviceTypeId"
                    className="font-semibold text-xs"
                  >
                    Select Device Type
                  </label>
                  <Field
                    as="select"
                    name="deviceTypeId"
                    id="deviceTypeId"
                    className="px-1 py-2 w-full rounded outline-none border-2 border-gray-400 focus:border-black"
                  >
                    <option value="">Select device type</option>
                    {DeviceType.map((item, index) => (
                      <option key={index} value={item.deviceSearch}>
                        {item.deviceName}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    component={"div"}
                    name="deviceTypeId"
                    className="text-xss text-red-700"
                  />
                </div>
              </div>
              <div className="flex w-full gap-2 mt-3">
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="showGoogleAddress"
                    className="font-semibold text-xs"
                  >
                    Show Google Address
                  </label>
                  <div className="flex  items-center gap-2">
                    <Field type="checkbox" name="showGoogleAddress" />
                    <span className="font-semibold">{`${values.showGoogleAddress}`}</span>
                  </div>
                  <ErrorMessage
                    component={"div"}
                    name="showGoogleAddress"
                    className="text-xss text-red-700"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="tripWiseReport"
                    className="font-semibold text-xs"
                  >
                    Trip Wise Report Generate
                  </label>
                  <div className="flex  items-center gap-2">
                    <Field type="checkbox" name="tripWiseReport" />
                    <span className="font-semibold">{`${values.tripWiseReport}`}</span>
                  </div>
                  <ErrorMessage
                    component={"div"}
                    name="tripWiseReport"
                    className="text-xss text-red-700"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-3">
                  <div className="flex flex-col w-full">
                    <label
                      htmlFor="shiftType"
                      className="font-semibold text-xs"
                    >
                      Select Shift Type
                    </label>
                    <Field
                      as="select"
                      name="shiftType"
                      id="shiftType"
                      className="px-1 py-2 w-full rounded outline-none border-2 border-gray-400 focus:border-black"
                    >
                      <option value="">Select shift type</option>
                      {
                        shiftType.map((item,index)=>(
                          <option key={index} value={item.shift}>{item.name}</option>
                        ))
                      }
                    </Field>
                    <ErrorMessage
                      component={"div"}
                      name="shiftType"
                      className="text-xss text-red-700"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label
                      htmlFor="reportEnable"
                      className="font-semibold text-xs"
                    >
                      Report Enabled
                    </label>
                    <div className="flex  items-center gap-2">
                      <Field type="checkbox" name="reportEnable" />
                      <span className="font-semibold">{`${values.reportEnable}`}</span>
                    </div>
                    <ErrorMessage
                      component={"div"}
                      name="reportEnable"
                      className="text-xss text-red-700"
                    />
                  </div>
              </div>
              <div className="flex w-full gap-2 mt-3">
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="deviceVersion"
                    className="font-semibold text-xs"
                  >
                    Select Device Version
                  </label>
                  <Field
                    as="select"
                    name="deviceVersion"
                    id="deviceVersion"
                    className="px-1 py-2 w-full rounded outline-none border-2 border-gray-400 focus:border-black"
                  >
                    <option value="">Select device version</option>
                    {deviceVersionType.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    component={"div"}
                    name="deviceVersion"
                    className="text-xss text-red-700"
                  />
                </div>
                <div className="flex flex-col w-full" />
              </div>

              <div className="flex justify-end gap-4 mt-3">
                <Button disabled={isLoading} type="submit" colorScheme="green">
                  Submit
                </Button>
                <Button onClick={onClose} type="button" colorScheme="red">
                  Cancel
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      {isOpen && (
        <ChakraUiModal
          scroll={true}
          modalSize="lg"
          isOpen={isOpen}
          onClose={onErrorClose}
          modalHeader="Error"
        >
          <div>
            {errors.map((item, index) => (
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {<GoDotFill size={12} color="black" />}
                </span>
                <p className="font-medium py-2 " key={index}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </ChakraUiModal>
      )}
    </>
  );
};

export default AddSingleDeviceForm;
