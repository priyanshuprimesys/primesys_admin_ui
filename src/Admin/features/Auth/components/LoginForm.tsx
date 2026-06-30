import { Form, Formik, FormikProps } from 'formik';
import { ILoginRequestInterface } from '../interfaces/LoginRequestInterface';
import CustomFormikInput from '../../../../shared/TextInput/FormikInput/CustomFormikInput';
import { LoginValidationSchema } from '../hooks/LoginValidationSchema';
import { Button } from '@chakra-ui/react';
import { useState } from 'react';
import { useGetLogin } from '../hooks/useUserLogin';





const LoginForm = () =>{

    const [isLoading,setIsLoading] = useState<boolean>(false);
    const {mutate} = useGetLogin();


    return(
        <>
            <Formik
            validationSchema={LoginValidationSchema}
            onSubmit={(values,action)=>{
                setIsLoading(true);
                mutate({
                    email:values.email,
                    password:values.password
                });
                setTimeout(() => {
                    action.setSubmitting(true);
                    setIsLoading(false);
                }, 1300);
            }}
            initialValues={{
                email:"",
                password:""
            }}
            >
                {
                    ({}:FormikProps<ILoginRequestInterface>)=>(
                        <Form>
                            <CustomFormikInput
                            labelClass="text-white"
                            label="Username"
                            name="email"
                            type="email"
                            className="text-black !border-t-0 !border-l-0 !border-r-0 !bg-gray-600 mb-2"
                            />
                            <CustomFormikInput  
                            labelClass="text-white"
                            label="Password"
                            name="password"
                            type="password"
                            className="text-black !border-t-0 !border-l-0 !border-r-0 !bg-gray-600 mb-2"
                            />

                            <Button isLoading={isLoading} isDisabled={isLoading} className='mt-6 font-medium tracking-wider !text-white !bg-primary w-full' type="submit">
                                Login
                            </Button>
                        </Form>
                    )
                }
            </Formik>
        </>
    )
}



export default LoginForm;