import { SuccessInterface } from "../SuccessResponseInterface/SuccessInterface";

export interface IRenewDeviceResponseInterface extends SuccessInterface {
  data: {
    result: string;
  };
  error: {
    code: number;
    message: string;
  };
}
