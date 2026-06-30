import { Form, Formik, FormikProps } from "formik"
import { KeyManFileUploadValidation } from "../../hooks/KeyManFileUploadValidation"
import { IKeyManFileUploadRequestInterface } from "../../../../../interfaces/AppInterfaces/KeyManBeatInterface/IKeyManFileUploadRequestInterface"
import CustomFormikInput from "../../../../../global/components/input/CustomInputBox/CustomFormikInput"
import Button from "../../../../../global/components/button/Button"
import { KeyManFileUploadContext } from "../../../../../contexts/AppLayout/Admin/KeymanBeatContext/KeyManFileUploadContext/KeyManFileUploadContext"
import { useContext } from "react"
import CustomFormikFileUpload from "../../../../../global/components/input/CustomInputBox/CustomFormikFileUpload"

interface AddMultiProps{
    setShowModal:(show:boolean) => void;
}



const AddMultipleBeatForm:React.FC<AddMultiProps> = ({setShowModal}) => {

    const {parentDivisionId} = useContext(KeyManFileUploadContext);


  return (
    <>
     <Formik
     initialValues={{ 
        divisionId:parentDivisionId,
        file: ""
      }}
     validationSchema={KeyManFileUploadValidation}
     onSubmit={(_values,action)=>{
        setTimeout(()=>{
            // mutate({divisionId:values.divisionId,file:values.file});
            setShowModal(false);
            action.setSubmitting(false);
        },700);
     }}
     onReset={()=>{
        setShowModal(false);
     }}
     >
        {
            ({resetForm,setFieldValue}:FormikProps<IKeyManFileUploadRequestInterface>)=>(
                <Form>
                    <div>
                        <CustomFormikInput
                        name="divisionId"
                        label="Division Id"
                        placeHolder="Enter division id"
                        readOnly
                        />
                        <CustomFormikFileUpload
                        placeHolder="Upload file"
                        name="file"
                        label="File"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>)=>{
                            setFieldValue("file",event.currentTarget.files?.[0] ||"");
                        }}
                        />
                    </div>
                    <div className="flex space-x-4">
                        <Button success={false} name="Cancel" type="button" onHandleSubmit={resetForm} />
                        <Button success={true} name="Submit" type="submit" />
                    </div>
                </Form>
            )
        }
    </Formik> 
    </>
  )
}

export default AddMultipleBeatForm
