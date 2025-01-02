import { ErrorCustom } from "./error";

export class ResponseCustom {
  data: any;
  error: ErrorCustom;
  pagination: any;

  constructor(data: any, error: ErrorCustom = null, pagination: any = null) {
    this.data = data;
    this.error = error;
    this.pagination = pagination;
  }
}
