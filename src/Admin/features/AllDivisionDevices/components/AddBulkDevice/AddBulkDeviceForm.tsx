import { ErrorMessage, Field, Form, Formik, FormikProps } from "formik";
import { IAddBulkDevicesInterface } from "../../../../../interfaces/AppInterfaces/AllDivisionDevices/AddBulkDevicesInterface";
import { Button, useDisclosure } from "@chakra-ui/react";
import CustomFormikFileUpload from "../../../../../global/components/input/CustomInputBox/CustomFormikFileUpload";
import { BulkDeviceUploadValidation } from "../../hooks/BulkDeviceUploadValidation";
import { useMutateDeviceUpload } from "../../../../../api/queries/app/hooks/device-upload-api-hooks";
import { useEffect, useState } from "react";
import { useSuccessNotification } from "../../../../../utils/hooks/notification/useSuccessNotification";
import { useErrorNotification } from "../../../../../utils/hooks/notification/useErrorNotification";
import { simType, deviceVersionType } from "../../data/deviceOptions";
import ChakraUiModal from "../../../../../global/components/Modals/components/ChakraUiModal";
import { GoDotFill } from "react-icons/go";

interface AddBulkDeviceFormInterface {
  parentId: string;
  onClose: () => void;
}

// \n860369070050123 device is already associated with division id 671a243d6467e437fb64a711\n860369070050107 device is already associated with division id 658a7f9ef7c9f16b673a06c0"

const AddBulkDeviceForm: React.FC<AddBulkDeviceFormInterface> = ({
  parentId,
  onClose,
}) => {
  const { mutate, data } = useMutateDeviceUpload();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { onClose: onErrorClose, onOpen, isOpen } = useDisclosure();
  const [errors, setErrors] = useState<Array<any>>([]);

  useEffect(() => {
    if (data?.data.success === true) {
      useSuccessNotification("Devices Uploaded");
      onClose();
    } else if (data?.data.success === false) {
      setIsLoading(false);
      onOpen();
      const result = data.data.error.message
        .trim()
        .split("\n")
        .map((line) => {
          const match = line.match(/(\d+)'?.*division id (\w+)/);
          if (match) {
            const deviceId = match[1];
            const divisionId = match[2];
            return `${deviceId} is associated with ${divisionId}`;
          } else {
            return line;
          }
        })
        .filter(Boolean);

      setErrors(result);
      useErrorNotification("Device is already associated");
    }
  }, [data]);

  return (
    <>
      <Formik
        onSubmit={(values, action) => {
          setIsLoading(true);
          setTimeout(() => {
            mutate({
              file: values.file,
              device: values.device,
              deviceStartSerialNo: values.deviceStartSerialNo,
            });
            action.setSubmitting(false);
          }, 800);
        }}
        validationSchema={BulkDeviceUploadValidation}
        initialValues={{
          file: "",
          device: {
            deviceTypeId: 0,
            divisionId: parentId,
            onTrackMargin: 100, // Nearest distance for RDPS
            reportAsIndependentRdps: false,
            reportDistMargin: 800, // Distance Margin for Report
            reportTimeMargin: 1800, // Time Margin for Report
            showGoogleAddress: false,
            deviceUserType: "person",
            simServiceProvider: "",
            deviceVersion: "",
          },
          deviceStartSerialNo: 1,
        }}
      >
        {({ values, setFieldValue }: FormikProps<IAddBulkDevicesInterface>) => (
          <Form>
            <div className="flex justify-between gap-2 items-center">
              <div className="flex flex-col w-full gap-2">
                <label
                  htmlFor="onTrackMargin"
                  className="font-semibold text-xs"
                >
                  Nearest distance for RDPS
                </label>
                <Field
                  type="number"
                  id="onTrackMargin"
                  name="device.onTrackMargin"
                  placeholder="Enter Nearest Distance for RDPS"
                  className="px-2 py-2 outline-none border-2 rounded border-black"
                />
              </div>
              <div className="flex flex-col w-full gap-2">
                <label
                  htmlFor="reportDistMargin"
                  className="font-semibold text-xs"
                >
                  Distance Margin for Report
                </label>
                <Field
                  type="number"
                  id="reportDistMargin"
                  name="device.reportDistMargin"
                  placeholder="Enter Distance Margin for Report"
                  className="px-2 py-2 outline-none border-2 rounded border-black"
                />
              </div>
            </div>
            <div className="flex justify-between gap-2 items-center mt-2">
              <div className="flex flex-col w-full gap-2">
                <label
                  htmlFor="reportTimeMargin"
                  className="font-semibold text-xs"
                >
                  Time Margin for report
                </label>
                <Field
                  type="number"
                  id="reportTimeMargin"
                  name="device.reportTimeMargin"
                  placeholder="Enter Nearest Distance for RDPS"
                  className="px-2 py-2 outline-none border-2 rounded border-black"
                />
              </div>
              <div className="flex flex-col w-full gap-2">
                <label
                  htmlFor="deviceStartSerialNo"
                  className="font-semibold text-xs"
                >
                  Start with
                </label>
                <Field
                  type="text"
                  id="deviceStartSerialNo"
                  name="deviceStartSerialNo"
                  placeholder="Enter device number start with"
                  className="px-2 py-2 outline-none border-2 rounded border-black"
                />
              </div>
            </div>
            <div className="flex justify-center gap-2 items-center">
              <div className="flex flex-col w-full  mt-2">
                <label
                  htmlFor="deviceUserType"
                  className="font-semibold text-xs"
                >
                  Device User Type
                </label>
                <Field
                  as="select"
                  name="device.deviceUserType"
                  className="border-2 border-black py-2 px-2 rounded"
                >
                  <option value="person">Person</option>
                  <option value="car">Car</option>
                </Field>
              </div>
              <div className="flex flex-col w-full mt-2">
                <label
                  htmlFor="device.simServiceProvider"
                  className="font-semibold text-xs"
                >
                  Device Sim Type
                </label>
                <Field
                  as="select"
                  name="device.simServiceProvider"
                  className="border-2 border-black py-2 px-2 rounded"
                >
                  <option value="">Select Sim Type</option>
                  {simType.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </Field>
              </div>
            </div>

            <div className="flex justify-center gap-2 items-center">
              <div className="flex flex-col w-full mt-2">
                <label
                  htmlFor="device.deviceVersion"
                  className="font-semibold text-xs"
                >
                  Device Version
                </label>
                <Field
                  as="select"
                  name="device.deviceVersion"
                  className="border-2 border-black py-2 px-2 rounded"
                >
                  <option value="">Select Device Version</option>
                  {deviceVersionType.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  component={"div"}
                  name="device.deviceVersion"
                  className="text-xss text-red-700"
                />
              </div>
              <div className="flex flex-col w-full mt-2" />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex flex-col w-full gap-2">
                <label
                  htmlFor="reportDistMargin"
                  className="font-semibold text-xs"
                >
                  Show Google address
                </label>
                <div className="gap-2 flex">
                  <Field type="checkbox" name="device.showGoogleAddress" />
                  <p className="font-semibold ">{`${values.device.showGoogleAddress}`}</p>
                </div>
              </div>
              <CustomFormikFileUpload
                placeHolder="Upload file"
                name="file"
                label="File"
                className="w-full"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue("file", event.currentTarget.files?.[0] || "");
                }}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button disabled={isLoading} type="submit" colorScheme="green">
                Submit
              </Button>
              <Button onClick={onClose} type="button" colorScheme="red">
                Cancel
              </Button>
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

export default AddBulkDeviceForm;
