import { HttpException, HttpStatus } from '@nestjs/common';
import { ICreateError } from '../types';
import axios from 'axios';

export class ErrorResponse {
  constructor() {}
}

export const errorFactory = (
  payload: ICreateError | unknown,
): HttpException => {
  return new HttpException(
    (axios.isAxiosError<ICreateError>(payload) &&
      payload.response?.data.description) ||
      'Ошибка при выполнении запроса',
    HttpStatus.BAD_REQUEST,
  );
};
