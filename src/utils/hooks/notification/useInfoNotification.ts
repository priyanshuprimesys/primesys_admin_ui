import { Bounce, toast } from "react-toastify"




const useInfoNotification = (message: string) => {
    return toast.info(message, {
        position: "top-right",
        autoClose: 800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        pauseOnFocusLoss:false
    })
}


export {useInfoNotification};