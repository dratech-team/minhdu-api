export interface IError<T> {
  message: string;
  statusCode: number;
  data?: T;
}
