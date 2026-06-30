import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { IDeviceFileUploadInterface } from "../interfaces/DevicesFileUploadInterface";
import { userDeviceFileUpload } from "../services/api";




export const PostDeviceMutation = () =>{
    return useMutation({
        mutationKey:['post-device-mutation'],
        mutationFn:(request:IDeviceFileUploadInterface)=>{
            return userDeviceFileUpload(request);
        },
        retry:false,
        onSuccess:(data)=>{
            if(data.data.success === true){
                toast.success("Beat Uploaded successfully",{
                    position: "top-right"
                })
            }
        }
    })
}