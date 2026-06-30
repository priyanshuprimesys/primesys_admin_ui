import { Form, Formik, FormikProps } from "formik";
import CustomFormikStudentData from "../InputBox/FormikInputData/CustomFormikInputData";
import CustomFormikInput from "../../../../../global/components/input/CustomInputBox/CustomFormikInput";
import { DeviceExchangeReplaceInitialState } from "../../../../../initialStates/AppInitialStates/DeviceExchangeInitialState/DeviceExchangeReplaceInitialState";
import { IDeviceExchangeReplaceRequestInterface } from "../../../../../interfaces/AppInterfaces/DeviceExchangeInterface/DeviceExchangeReplaceRequestInterface";
import { ReplaceDeviceValidation } from "../../hooks/ReplaceDeviceValidation";
import { useEffect, useState } from "react";
import { usePostReplaceDeviceImeiKey } from "../../../../../api/queries/app/hooks/replace-device-imei-api-hooks";
import { useSuccessNotification } from "../../../../../utils/hooks/notification/useSuccessNotification";
import { useErrorNotification } from "../../../../../utils/hooks/notification/useErrorNotification";
import { Button } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { IDeviceReplaceErrorResponseInterface } from "../../../../../interfaces/AppInterfaces/DeviceExchangeInterface/DeviceReplaceResponseInterface";

interface ReplaceDeviceInterface {
  onClose: () => void;
}

const ReplaceDeviceForm: React.FC<ReplaceDeviceInterface> = ({ onClose }) => {
  const [replaceError, setReplaceError] = useState<string | undefined>("");

  const { mutate, data, isSuccess, isError, error } =
    usePostReplaceDeviceImeiKey();

  // 359751090172870 old
  // 359751090191193 new

  useEffect(() => {
    if (isSuccess === true) {
      useSuccessNotification("Device has been replaced");
      onClose();
      return;
    } else if (isError === true) {
      useErrorNotification("Error occurred");
      const err = error as AxiosError<IDeviceReplaceErrorResponseInterface>;
      setReplaceError(err.response?.data.error.message);
      // setReplaceError(error?.response.)
      // setError(data.data.error.message);
      return;
    }
  }, [data, isSuccess, isError, error]);

  return (
    <>
      <Formik
        initialValues={DeviceExchangeReplaceInitialState}
        validationSchema={ReplaceDeviceValidation}
        onSubmit={(values, action) => {
          mutate({
            oldDeviceImei: values.oldImeiNo,
            newDeviceImei: values.newImeiNo,
          });
          setTimeout(() => {
            action.setSubmitting(false);
          }, 1000);
        }}
        onReset={() => {}}
      >
        {({}: FormikProps<IDeviceExchangeReplaceRequestInterface>) => (
          <Form>
            <div className="flex w-full justify-center mb-4">
              <CustomFormikStudentData
                placeHolder="Select Device"
                name="oldImeiNo"
                className="w-full"
              />
              {/* <CustomFormikInput
                                    placeHolder="Enter name"
                                    name="deviceName"
                                /> */}
            </div>
            <div className="flex w-full justify-center">
              <CustomFormikInput
                placeHolder="Enter Imei No"
                name="newImeiNo"
                type="number"
                className="w-full border-2 border-gray-400 focus:border-black py-2 rounded px-1"
              />
              {/* <CustomFormikInput
                                    placeHolder="Enter Sim No"
                                    name="simNo"
                                    type="number"
                                /> */}
            </div>
            <div className="py-2">
              <p className="m-0 text-red-600 text-xss break-words">
                {replaceError}
              </p>
            </div>

            <div className="flex space-x-6 justify-end">
              <Button onClick={onClose} colorScheme="red" type="button">
                Cancel
              </Button>
              <Button type="submit" colorScheme="green">
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ReplaceDeviceForm;
