import { Field, Form, Formik, FormikProps } from "formik";
import { IRenewDeviceRequestInterface } from "../../../../../interfaces/AppInterfaces/RenewDeviceInterface/RenewDeviceRequestInterface";
import { useContext, useEffect } from "react";
import { UserDetailContext } from "../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import { Button } from "@chakra-ui/react";
import { useDeviceRenewQuery } from "../../../../../api/queries/app/hooks/renew-device-api-hooks";
import { useSuccessNotification } from "../../../../../utils/hooks/notification/useSuccessNotification";
import { useErrorNotification } from "../../../../../utils/hooks/notification/useErrorNotification";
import { useQueryClient } from "@tanstack/react-query";
import { student_device_detail_query_key } from "../../../../../api/queries/app/queryKeys/queryKeys";

interface RenewDeviceFormInterface {
  deviceId: string;
  data: any[];
  onClose: () => void;
}

const RenewDeviceForm: React.FC<RenewDeviceFormInterface> = ({
  deviceId,
  data,
  onClose,
}) => {
  const editData = data.filter((x) => x.deviceId === deviceId);

  const { userDetail } = useContext(UserDetailContext);

  const { mutate, data: renewData, isSuccess } = useDeviceRenewQuery();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isSuccess) {
      useSuccessNotification(renewData.data.data.result);
      queryClient.invalidateQueries({
        queryKey: [student_device_detail_query_key],
      });
      onClose();
    } else if (isSuccess) {
      useErrorNotification("Device renew failed");
    }
  }, [isSuccess]);

  return (
    <>
      <Formik
        onSubmit={(values, action) => {
          mutate({
            deviceId: values.deviceId,
            userLoginId: values.userLoginId,
            days: values.days,
          });
          setTimeout(() => {
            action.setSubmitting(false);
          }, 800);
        }}
        initialValues={{
          deviceId: editData[0].deviceId,
          userLoginId: userDetail.data.result.divisionId,
          days: "",
        }}
      >
        {({}: FormikProps<IRenewDeviceRequestInterface>) => (
          <Form>
            <div>
              <h1 className="my-2 font-medium text-xs">
                This device is valid till{" "}
                <b className="text-green-600 text-base">
                  {editData[0].validDay}
                </b>{" "}
                days
              </h1>
              <div className="flex flex-col">
                {/* <label htmlFor="name" className="text-xs font-semibold">
                  Name
                </label> */}
                <Field
                  id="name"
                  value={editData[0].name}
                  className="border-2 border-gray-400 focus:border-black py-2 px-2 rounded"
                  readOnly
                />
              </div>
              <div className="flex flex-col mt-3">
                <label htmlFor="days" className="text-xs font-semibold">
                  Enter days
                </label>
                <Field
                  type="number"
                  placeholder="Enter days for validation"
                  id="days"
                  name="days"
                  className="border-2 border-gray-400 focus:border-black py-2 px-2 rounded"
                />
              </div>
              <div className="mt-4 flex justify-end gap-4">
                <Button type="submit" colorScheme="green">
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
    </>
  );
};

export default RenewDeviceForm;
