const YOOKASSA_DEFAULT_URL = 'https://api.yookassa.ru/v3';

export { YOOKASSA_DEFAULT_URL as DEFAULT_URL };

export enum PaymentStatuses {
  'waiting_for_capture' = 'waiting_for_capture',
  'pending' = 'pending',
  'succeeded' = 'succeeded',
  'canceled' = 'canceled',
}

export enum ReceiptStatuses {
  'pending' = 'pending',
  'succeeded' = 'succeeded',
  'canceled' = 'canceled',
}

export enum WebHookEvents {
  'payment.waiting_for_capture' = 'payment.waiting_for_capture',
  'payment.succeeded' = 'payment.succeeded',
  'payment.canceled' = 'payment.canceled',
  'refund.succeeded' = 'refund.succeeded',
}

export enum RefundStatuses {
  'canceled' = 'canceled',
  'succeeded' = 'succeeded',
}
