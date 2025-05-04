import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  ICapturePayment,
  ICreateError,
  ICreatePayment,
  ICreateReceipt,
  ICreateRefund,
  IGetPaymentList,
  IGetReceiptList,
  IGetRefundList,
  IPaymentList,
  IReceiptList,
  IRefundList,
  IYooCheckoutOptions,
  YooCheckoutOptionsSymbol,
} from '../types';
import { v4 as uuidv4 } from 'uuid';
import { HttpService } from '@nestjs/axios';
import { DEFAULT_URL } from './yoocheckout.constants';
import {
  errorFactory,
  Payment,
  paymentFactory,
  Receipt,
  receiptFactory,
  Refund,
  refundFactory,
} from '../models';
import { firstValueFrom } from 'rxjs';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

@Injectable()
export class YooCheckoutService {
  private readonly shopId: string;
  private readonly apiKey: string;
  private readonly apiUrl: string;

  public constructor(
    @Inject(YooCheckoutOptionsSymbol)
    private readonly options: IYooCheckoutOptions,
    private readonly httpService: HttpService,
  ) {
    this.shopId = options.shopId;
    this.apiKey = options.apiKey;
    this.apiUrl = DEFAULT_URL;
  }

  private authData() {
    return {
      username: this.shopId,
      password: this.apiKey,
    };
  }

  private buildQuery(
    filters: IGetPaymentList | IGetRefundList | IGetReceiptList,
  ): string {
    const entries = Object.entries(filters);
    const queryString = entries.reduce(
      (sum, [param, value], index) =>
        value['value'] && value['mode']
          ? `${sum}${param}.${value['mode']}=${value['value']}${index < entries.length - 1 ? '&' : ''}`
          : `${sum}${param}=${value}${index < entries.length - 1 ? '&' : ''}`,
      '?',
    );

    return queryString === '?' ? '' : queryString;
  }

  private normalizeFilter(filters: any) {
    if (!Boolean(filters)) {
      return {};
    }

    return { ...filters };
  }

  /**
   * Create payment/Создает платеж.
   * @see https://yookassa.ru/developers/api#create_payment
   * @param {ICreatePayment} payload
   * @param {string} idempotenceKey
   * @returns {Promise<Payment>}
   */
  public async createPayment(
    payload: ICreatePayment,
    idempotenceKey: string = uuidv4(),
  ): Promise<Payment> {
    try {
      const options: AxiosRequestConfig = {
        auth: this.authData(),
        headers: { 'Idempotence-Key': idempotenceKey },
      };

      const { data } = await firstValueFrom(
        this.httpService.post<Payment>(
          `${this.apiUrl}/payments`,
          payload,
          options,
        ),
      );
      return paymentFactory(data);
    } catch (error) {
      throw errorFactory(error);
    }
  }

  /**
   * Get payment by id/Получает платеж по его ID
   * @see https://yookassa.ru/developers/api#get_payment
   * @param {string} paymentId
   * @returns {Promise<Payment>}
   */
  public async getPayment(paymentId: string): Promise<Payment> {
    try {
      const options: AxiosRequestConfig = {
        auth: this.authData(),
      };

      const { data } = await firstValueFrom(
        this.httpService.get<Payment>(
          `${this.apiUrl}/payments/${paymentId}`,
          options,
        ),
      );

      return paymentFactory(data);
    } catch (error) {
      throw errorFactory(error);
    }
  }

  /**
   * Capture payment/Захват платежа.
   * @see https://yookassa.ru/developers/api#capture_payment
   * @param {string} paymentId
   * @param {ICapturePayment} payload
   * @param {string} idempotenceKey
   * @returns {Promise<Payment>}
   */
  public async capturePayment(
    paymentId: string,
    payload: ICapturePayment,
    idempotenceKey: string = uuidv4(),
  ): Promise<Payment> {
    try {
      const options = {
        auth: this.authData(),
        headers: { 'Idempotence-Key': idempotenceKey },
      };

      const { data } = await firstValueFrom(
        this.httpService.post<Payment>(
          `${this.apiUrl}/payments/${paymentId}/capture`,
          payload,
          options,
        ),
      );

      return paymentFactory(data);
    } catch (error) {
      throw errorFactory(error);
    }
  }

  /**
   * Cancel paymnet/Отменяет платеж.
   * @see https://yookassa.ru/developers/api#cancel_payment
   * @param {string} paymentId
   * @param {string} idempotenceKey
   * @returns {Promise<Payment>}
   */
  public async cancelPayment(
    paymentId: string,
    idempotenceKey: string = uuidv4(),
  ): Promise<Payment> {
    try {
      const options = {
        auth: this.authData(),
        headers: { 'Idempotence-Key': idempotenceKey },
      };
      const { data } = await firstValueFrom(
        this.httpService.post<Payment>(
          `${this.apiUrl}/payments/${paymentId}/cancel`,
          {},
          options,
        ),
      );

      return paymentFactory(data);
    } catch (error) {
      throw errorFactory(error);
    }
  }

  /**
   * Get payment list/Получает список платежей.
   * @see https://yookassa.ru/developers/api#get_payments_list
   * @param {Object} filters
   * @returns {Promise<IPaymentList>}
   */
  public async getPaymentList(
    filters: IGetPaymentList = {},
  ): Promise<IPaymentList> {
    const f = this.normalizeFilter(filters);

    try {
      const options = { auth: this.authData() };
      const { data } = await firstValueFrom(
        this.httpService.get<IPaymentList>(
          `${this.apiUrl}/payments${this.buildQuery(f)}`,
          options,
        ),
      );
      data.items = data.items.map((i: any) => paymentFactory(i));

      return data;
    } catch (error) {
      throw errorFactory(error);
    }
  }

  /**
   * Create refund/Создает возврат средств
   * @see https://yookassa.ru/developers/api#create_refund
   * @param {ICreateRefund} payload
   * @param {string} idempotenceKey
   * @returns {Promise<Refund>}
   */
  public async createRefund(
    payload: ICreateRefund,
    idempotenceKey: string = uuidv4(),
  ): Promise<Refund> {
    try {
      const options = {
        auth: this.authData(),
        headers: { 'Idempotence-Key': idempotenceKey },
      };

      const { data } = await firstValueFrom(
        this.httpService.post<Refund>(
          `${this.apiUrl}/refunds`,
          payload,
          options,
        ),
      );

      return refundFactory(data);
    } catch (error) {
      throw errorFactory(error);
    }
  }

  /**
   * Get refund by id/Получает возврат по его ID.
   * @see 'https://yookassa.ru/developers/api#get_refund'
   * @param {string} refundId
   * @returns {Promise<Refund>}
   */
  public async getRefund(refundId: string): Promise<Refund> {
    try {
      const options = { auth: this.authData() };
      const { data } = await firstValueFrom(
        this.httpService.get<Refund>(
          `${this.apiUrl}/refunds/${refundId}`,
          options,
        ),
      );

      return refundFactory(data);
    } catch (error) {
      throw errorFactory(error);
    }
  }

  /**
   * Get refund list/Получает список всех возвратов.
   * @see https://yookassa.ru/developers/api#get_refunds_list
   * @param {Object} filters
   * @returns {Promise<IRefundList>}
   */
  public async getRefundList(filters: IGetRefundList = {}): Promise<IRefundList> {
    const f = this.normalizeFilter(filters);
    try {
      const options = { auth: this.authData() };
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/refunds`, options),
      );
      data.items = data.items.map((i: any) => paymentFactory(i));

      return data;
    } catch (error) {
      throw errorFactory(error);
    }
  }

  /**
   * Create receipt/Создает чек
   * @see 'https://yookassa.ru/developers/api#create_receipt'
   * @param {ICreateReceipt} payload
   * @param {string} idempotenceKey
   * @returns {Promise<Receipt>}
   */
  public async createReceipt(
    payload: ICreateReceipt,
    idempotenceKey: string = uuidv4(),
  ): Promise<Receipt> {
    try {
      const options = {
        auth: this.authData(),
        headers: { 'Idempotence-Key': idempotenceKey },
      };
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/receipts`, payload, options),
      );

      return receiptFactory(data);
    } catch (error) {
      throw errorFactory(error);
    }
  }

  /**
   * Get receipt by id/Получает чек по его ID
   * @see 'https://yookassa.ru/developers/api#get_receipt'
   * @param {string} receiptId
   * @returns {Promise<Receipt>}
   */
  public async getReceipt(receiptId: string): Promise<Receipt> {
    try {
      const options = { auth: this.authData() };
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/receipts/${receiptId}`, options),
      );

      return receiptFactory(data);
    } catch (error) {
      throw errorFactory(error);
    }
  }

  /**
   * Get receipt list/Получает список чеков
   * @see 'https://yookassa.ru/developers/api#get_receipts_list'
   * @param {Object} filters
   * @returns {Promise<Object>}
   */
  public async getReceiptList(
    filters: IGetReceiptList = {},
  ): Promise<IReceiptList> {
    const f = this.normalizeFilter(filters);
    try {
      const options = { auth: this.authData() };
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${this.apiUrl}/receipts${this.buildQuery(f)}`,
          options,
        ),
      );
      data.items = data.items.map((i: any) => receiptFactory(i));

      return data;
    } catch (error) {
      throw errorFactory(error);
    }
  }
}
