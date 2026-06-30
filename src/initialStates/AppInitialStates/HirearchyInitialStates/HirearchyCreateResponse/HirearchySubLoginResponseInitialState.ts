import {  IHirearchySubLoginResponseInterface } from "../../../../interfaces/AppInterfaces/HirearchyInterface/HirearchyCreateInterface/HirearchySubLoginResponseInterface";
import { HirearchyCreateResponseInitialState } from "./HirearchyCreateResponseInitialState";







export const HirearchySubLoginResponseInitialState:IHirearchySubLoginResponseInterface={
    data:{
        result:HirearchyCreateResponseInitialState
    },
    error:{
        code:0,
        message:""
    },
    success:false,
}