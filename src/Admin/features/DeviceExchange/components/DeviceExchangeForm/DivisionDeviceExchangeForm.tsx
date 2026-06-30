import {  Form, Formik, FormikProps  } from "formik"
import { DeviceExchangeRequestInitialState } from "../../../../../initialStates/AppInitialStates/DeviceExchangeInitialState/DeviceExchangeRequestInitialState"
import {  useState } from "react"
// import { UserDetailContext } from "../../../../../contexts/AppLayout/UserDetailContext/UserDetailContext"
import { DeviceExchangeRequestInterface } from "../../../../../interfaces/AppInterfaces/DeviceExchangeInterface/DeviceExchangeRequestInterface"
import { useGetStudentDeviceDetailQuery } from "../../../../../api/queries/app/hooks/student-device-detail-api-hooks"
import ParentDataSearchSelect from "../../../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select"
import Button from "../../../../../global/components/button/Button"
import CustomFormikStudentData from "../InputBox/FormikInputData/CustomFormikInputData"

const DivisionDeviceExchangeForm = () => {

    const [parentId,setParentId] = useState<string>('');

    const [_studentDeviceIdOne,setStudentDeviceIdOne] = useState<string>('');
    // const [studentDeviceIdTwo,setStudentDeviceIdTwo] = useState<string>('');

    const {data} = useGetStudentDeviceDetailQuery(parentId);

    // const {userDetail} = useContext(UserDetailContext);



  return (
    <div>
      <Formik
      initialValues={DeviceExchangeRequestInitialState}
      onSubmit={(_values,action)=>{
        setTimeout(() => {
            action.setSubmitting(false);
        }, 700);
      }}
      onReset={(values)=>{
            values.newDeviceId = "";
            values.oldDeviceId = "";
            values.userId = "";
      }}
      >
        {
            ({resetForm}:FormikProps<DeviceExchangeRequestInterface>)=>(
               <Form>
                    <ParentDataSearchSelect placeHolder="Enter Parent Name" setInputData={setParentId} />

                    <CustomFormikStudentData
                    placeHolder="Enter student name"
                    type="search"
                    name="name"
                    value="deviceId"
                    dataVal="deviceId"
                    inputvalOne="name"
                    inputValTwo="imeiNo"
                    setSelectedId={setStudentDeviceIdOne}
                    data={data? data.data.data.result : []}
                    />

                    <div className="flex my-4 space-x-4">
                      <Button type="button" success={false} name="Clear" onHandleSubmit={resetForm}  />
                      <Button type="submit" success={true} name="Exchange"  />

                    </div>
               </Form> 
            )
        }

      </Formik>
    </div>
  )
}

export default DivisionDeviceExchangeForm
