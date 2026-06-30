import * as yup from "yup";


export const KeyManFileUploadValidation = yup.object().shape({
    divisionId: yup.string().required("This is required"),
    file: yup
      .mixed()
      .required("A file is required")
      .test("is-file-of-correct-type", "Only Excel files are accepted (xls, xlsx)", (value: any) => {
        if (!value) {
          return false;
        }
  
        if (value instanceof File) {
          const fileExtension = value.name.split(".").pop()?.toLowerCase();
          return ['xls', 'xlsx'].includes(fileExtension || "");
        }
  
        return false;
      }),
  });