export interface IError<T> {
  message: string;
  status: number;
  data?: T;
}
