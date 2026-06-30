import { SuccessInterface } from "../SuccessResponseInterface/SuccessInterface";

export interface IRenewDivisionResponseInterface extends SuccessInterface {
  data: {
    result: string;
  };
  error: {
    code: number;
    message: string;
  };
}
