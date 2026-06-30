import { UserDetailInterface } from "../../interfaces/AppInterfaces/UserDetailInterface/UserDetailInterface";

export const UserDetailInitialState:UserDetailInterface ={
    data:{
        result:{
            userName:'',
            mobileNo:'',
            emailID:'',
            roleId:0,
            divisionId:'',
            socketUrl:'',
            distUnit:'',
        }
    },
    success:false
}