import { createContext } from "react";






interface CustomerInterface{
 customerEmail:string;
 setCustomerEmail: React.Dispatch<React.SetStateAction<string>>;
 customerPassword:string;
 setCustomerPassword: React.Dispatch<React.SetStateAction<string>>;
 parentUserName:string;
 setParentUserName: React.Dispatch<React.SetStateAction<string>>;
 customerDivisionId:string;
 setCustomerDivisonId: React.Dispatch<React.SetStateAction<string>>;
 loginName:string;
 setLoginName: React.Dispatch<React.SetStateAction<string>>;
 parentId:string;
 setParentId: React.Dispatch<React.SetStateAction<string>>;
 customerLogged: boolean;
 setCustomerLogged: React.Dispatch<React.SetStateAction<boolean>>;
}



const LoginDetail:CustomerInterface={
    customerEmail:"",
    setCustomerEmail:() => {},
    customerPassword:"",
    setCustomerPassword:() => {},
    parentUserName:'',
    setParentUserName:() =>{},
    customerDivisionId:'',
    setCustomerDivisonId:() => {},
    loginName:"",
    setLoginName:()=> {},
    parentId:"",
    setParentId:() =>{},
    customerLogged:false,
    setCustomerLogged:() => {}
}


export const CustomerLoginDetailContext = createContext(LoginDetail);