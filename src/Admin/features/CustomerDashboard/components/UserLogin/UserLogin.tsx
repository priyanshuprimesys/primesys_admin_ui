import { useGetDivisionParentId } from "../../../../../api/queries/app/hooks/division-parent-id-api-hooks";
import ParentDataSearchSelect from "../../../../../global/components/search_Input/input-box-with-search-data/components/Parent_Data_Search_Select";
import { useContext, useEffect } from "react";
import LoginInputData from "../LoginInputData/LoginInputData";
import { CustomerLoginDetailContext } from "../../context/CustomerLoginDetailContext/CustomerLoginDetailContext";
import { Button } from "@chakra-ui/react";
import { useCustomerAuthenticate } from "../../hooks/mutation/AuthenticateHook/customer-auth-hooks";
import { useErrorNotification } from "../../../../../utils/hooks/notification/useErrorNotification";
import { getCustomerAuthToken } from "../../services/AuthService/AuthService";
const UserLogin = () => {

  const { setCustomerEmail, setCustomerPassword,customerEmail,customerPassword,setParentUserName,setLoginName,parentId,setParentId ,setCustomerLogged} = useContext(
    CustomerLoginDetailContext
  );
  const { data, isSuccess } = useGetDivisionParentId(parentId);
  

  useEffect(()=>{
    const checkToken = async() =>{
      const token = await getCustomerAuthToken();
      if(token === false)
      {
        setCustomerLogged(false);
      }
      else{
        setCustomerLogged(true);
      }
    }
    checkToken();
  },[]);


  const {mutate} = useCustomerAuthenticate();





  const onHandleLogin = ()=>{
    if(customerEmail === "")
    {
      useErrorNotification("Please select user");
      return;
    }
    else{
      mutate({
        email:customerEmail,
        password: customerPassword
      });

    }
  }

  return (
    <>
      <div className="flex w-full gap-3 items-center">
          <ParentDataSearchSelect
            placeHolder="Enter username"
            setInputData={setParentId}
            setParentUserName={setParentUserName}
          />
            <LoginInputData
            parentId={parentId}
            setLoginName={setLoginName}
              setUserName={setCustomerEmail}
              setUserPassword={setCustomerPassword}
              data={isSuccess ? data?.data.data.result : []}
            />
          <div>
            <Button  onClick={onHandleLogin} colorScheme="green" className="!text-white">
              Log In
            </Button>
          </div>
      </div>
    </>
  );
};

export default UserLogin;
