import { useMutation } from "@tanstack/react-query"
import { IssueUploadFile } from "../services/api";
import { IUploadRequest } from "../Interface/FileInterface";
import { toast } from "react-toastify";




export const UploadFileHook = () =>{
    return useMutation({
        mutationKey:['upload-file-attachment-mutation'],
        mutationFn:(request:IUploadRequest)=>{
            return IssueUploadFile(request);
        },
        retry: false,
        onSuccess:(data)=>{
            if(data.data.success){
                toast.success("File uploaded successfully",{
                    delay:300,
                    pauseOnHover:false,
                });
            }
        },
        onError:()=>{
            toast.error("File not uploaded");
        }
    });
}