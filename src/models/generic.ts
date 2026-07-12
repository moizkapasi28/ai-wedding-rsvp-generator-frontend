export interface GenericResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}
