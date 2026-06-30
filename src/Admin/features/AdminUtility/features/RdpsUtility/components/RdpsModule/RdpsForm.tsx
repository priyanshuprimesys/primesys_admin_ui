import { Form, Formik, FormikProps } from "formik";
import { Button } from "@chakra-ui/react";
import CustomFormikFileUpload from "../../../../../../../global/components/input/CustomInputBox/CustomFormikFileUpload";
import { RdpsFomrikInterface } from "../../../../../../../interfaces/AppInterfaces/RdpsInterface/RdpsInterface";
import { useDivisionPostRDPS } from "../../../../../../../api/queries/app/hooks/division-rdps-api-hooks";
import { useEffect, useState } from "react";

interface RdpsFormInterface {
  parentId: string;
  onClose: () => void;
}

export const RdpsForm: React.FC<RdpsFormInterface> = ({
  parentId,
  onClose,
}) => {
  const { mutate, data,isPending } = useDivisionPostRDPS();
  const [message, setMessage] = useState<string[]>([]);

  useEffect(() => {
    if (data?.data.success === true) {
      const stringArray = data?.data?.data?.result
        .split(/\n/)
        .filter((line) => line.trim() !== "");
      setMessage(stringArray);
      return;
    } else if (data?.data.success === false) {
      const stringArray = data?.data?.data?.result
        .split(/\n/)
        .filter((line) => line.trim() !== "");
      setMessage(stringArray);
      return;
    }
  }, [data]);

  return (
    <>
      <Formik
        onSubmit={(values, action) => {
          mutate({
            file: values.file,
            divisionId: values.divisionId,
          });
          setTimeout(() => {
            action.setSubmitting(false);
          }, 800);
        }}
        initialValues={{
          file: "",
          divisionId: parentId,
        }}
      >
        {({ setFieldValue }: FormikProps<RdpsFomrikInterface>) => (
          <Form>
            <div>
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
            <div className="flex justify-end gap-2">
              <Button onClick={onClose} colorScheme="red" type="button">
                Close
              </Button>
              <Button colorScheme="green" type="submit">
                Upload
              </Button>
            </div>
            <div>
              <h1 className="text-base font-semibold underline underline-offset-1">Rdps Status</h1>
              <div>

                {
                isPending
                ?
                'Uploading.......'
                :
                message.map((item, index) => (
                  <h1 key={index} className="py-2 font-semibold">
                    {item}
                  </h1>
                ))}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};
