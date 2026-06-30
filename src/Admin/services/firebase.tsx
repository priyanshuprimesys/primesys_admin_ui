import {initializeApp} from "firebase/app";
import {getMessaging, getToken} from "firebase/messaging";
import axiosApi from "../../utils/axiosInstance/AxiosConfig";
import axios from "axios";
import { toast } from "react-toastify";
// import {getAnalytics} from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyBmBIazQntYBp8Ljr5IeHekFg6AKa3F-Ng",
  authDomain: "primesys-track-fcm.firebaseapp.com",
  databaseURL: "https://primesys-track-fcm.firebaseio.com",
  projectId: "primesys-track-fcm",
  storageBucket: "primesys-track-fcm.firebasestorage.app",
  messagingSenderId: "740167304232",
  appId: "1:740167304232:web:d9f918b5bc12042a06211d"
};



//  Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
// const analytics = getAnalytics(app);


export const generateToken = async ():Promise<void>=>{
    const permission = await Notification.requestPermission();
    if(permission == "granted"){
        const token = await getToken(messaging,{
            vapidKey:"BOPXnGF7ReUnzT33FwgUJnDDzN8R1qJeA6oFb4CElmVv3rHH4VmGdRDUQo332TKMlNkiYP6SR84ngBY8IKzYi_0"
        });
        console.log(token,"token")
    }
}



export async function postFcmToken(token: string, userDetail: string): Promise<void> {
    try {
        await axiosApi.patch(
            `/v2/division-logins/add-fcm-token?divisionId=${userDetail}&token=${token}&updatedBy=${userDetail}`
        );
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            toast.error("No token saved");
        }
    }
}