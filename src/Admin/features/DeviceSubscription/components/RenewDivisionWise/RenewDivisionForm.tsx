import { Field, Form, Formik, FormikProps } from "formik";
import { useContext, useEffect } from "react";
import { UserDetailContext } from "../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext";
import { Button } from "@chakra-ui/react";
import { useSuccessNotification } from "../../../../../utils/hooks/notification/useSuccessNotification";
import { useErrorNotification } from "../../../../../utils/hooks/notification/useErrorNotification";
import { IRenewDivisionRequestInterface } from "../../../../../interfaces/AppInterfaces/RenewDivisionInterface/RenewDivisionRequestInterface";
import { useRenewDivisionQuery } from "../../../../../api/queries/app/hooks/renew-division-api-hooks";
import { useQueryClient } from "@tanstack/react-query";
import { student_device_detail_query_key } from "../../../../../api/queries/app/queryKeys/queryKeys";

interface RenewDeviceFormInterface {
  parentId: string;
  onClose: () => void;
}

const RenewDivisionForm: React.FC<RenewDeviceFormInterface> = ({
  parentId,
  onClose,
}) => {
  const { userDetail } = useContext(UserDetailContext);

  const { mutate, data: renewData } = useRenewDivisionQuery();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (renewData?.data.success === true) {
      useSuccessNotification(renewData.data.data.result);
      queryClient.invalidateQueries({
        queryKey: [student_device_detail_query_key],
      });

      onClose();
    } else if (renewData?.data.success === false) {
      useErrorNotification(renewData.data.error.message);
    }
  }, [renewData]);

  return (
    <>
      <Formik
        onSubmit={(values, action) => {
          mutate({
            divisionId: values.divisionId,
            userLoginId: values.userLoginId,
            days: values.days,
          });
          setTimeout(() => {
            action.setSubmitting(false);
          }, 800);
        }}
        initialValues={{
          divisionId: parentId,
          userLoginId: userDetail.data.result.divisionId,
          days: "",
        }}
      >
        {({}: FormikProps<IRenewDivisionRequestInterface>) => (
          <Form>
            <div>
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

export default RenewDivisionForm;
