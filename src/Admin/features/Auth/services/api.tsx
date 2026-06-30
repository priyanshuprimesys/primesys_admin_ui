import axios, { AxiosError, AxiosResponse } from "axios";
import { TokenResponseInterface } from "../../../../interfaces/AuthInterfaces/TokenResponse/TokenResponseInterface";
import { TokenResponseErrorInterface } from "../../../../interfaces/AuthInterfaces/TokenResponse/TokenResponseErrorInterface";


export async function authenticateUser(username: string, password: string): Promise<AxiosResponse<TokenResponseInterface>> {


   try {
      const response = await axios.post('https://api.mykidtrackers.com/admin-service/api/v1/auth/authenticate', {
         'email': username,
         password
      });
      return response;
   } catch (error: unknown) {

      if (axios.isAxiosError(error)) {
         const netError = error as AxiosError<TokenResponseErrorInterface>;
         if (netError.response?.status === 403) {
            throw new Error('403');
         }
         else {
            throw new Error(netError.message);
         }

      }
      else {
         throw new Error('Unexpected Error');
      }
   }
}