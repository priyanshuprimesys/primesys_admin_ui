import { SuccessInterface } from "../../../../../../../../interfaces/AppInterfaces/SuccessResponseInterface/SuccessInterface";



export interface IIssueCategoriesInterface{
    category:string;
    subcategories:string[]
}


export interface IIssueCategoriesResponse extends SuccessInterface{
    data:{
        result: IIssueCategoriesInterface[]
    },
    errors:{
        message:string
    }
}