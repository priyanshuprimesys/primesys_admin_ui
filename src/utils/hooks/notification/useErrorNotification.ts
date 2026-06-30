import { Bounce, toast } from "react-toastify"




const useErrorNotification = (message:string) =>{
    return toast.error(message,{
        position:"top-right",
        autoClose:1000,
        hideProgressBar:false,
        closeOnClick:true,
        pauseOnHover:false,
        draggable:false,
        progress:undefined,
        theme:"colored",
        transition:Bounce,
        pauseOnFocusLoss:false
    })
};



export {useErrorNotification};