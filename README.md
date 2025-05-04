# NestJS YooCheckout

#### This library is a port [a2seven/yoocheckout](https://github.com/a2seven/yoocheckout) for the nestjs framework. Some functionality may not be available.

#### The functionality that is available in the library at the moment is enough to accept payments.

## Installation
```bash
npm install nestjs-yoocheckout
```
```bash
yarn add nestjs-yoocheckout
```

## Getting started

To connect the library in your project, you need to use one of two methods:

- forRoot is a synchronous configuration.
- forRootAsync — asynchronous configuration (recommended).

**1. Synchronous configuration (forRoot)**
```typescript
import { Module } from '@nestjs/common'
import { YooCheckoutModule } from 'nestjs-yoocheckout'

@Module({
	imports: [
		YooCheckoutModule.forRoot({
			shopId: 'your-shop-id',
			apiKey: 'your-api-key'
		})
	]
})
export class AppModule {}
```

**2. Asynchronous configuration (forRootAsync)**
```typescript
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { YooCheckoutModule } from 'nestjs-yoocheckout'

@Module({
	imports: [
		YooCheckoutModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				shopId: configService.getOrThrow('YOOKASSA_SHOP_ID'),
				apiKey: configService.getOrThrow('YOOKASSA_API_KEY')
			}),
			inject: [ConfigService]
		})
	]
})
export class AppModule {}
```

## Docs
### [Create payment](https://yookassa.ru/developers/api#create_payment)
```typescript
import { Injectable } from '@nestjs/common'
import { ICreatePayment, YooCheckoutService } from 'nestjs-yoocheckout'

@Injectable()
export class PaymentService {
	constructor(private readonly yooCheckoutService: YooCheckoutService) {}

	async createPayment() {
		const paymentData: ICreatePayment = {
			amount: {
				value: 100,
				currency: 'RUB'
			},
			payment_method_data: {
				type: 'bank_card'
			},
			confirmation: {
				type: 'redirect',
				return_url: 'https://example.com/thanks'
			}
		}

		const newPayment =
			await this.yooCheckoutService.createPayment(paymentData)

		return newPayment
	}
}
```
### [Get payment list](https://yookassa.ru/developers/api#get_payments_list)
```javascript
import { Injectable } from '@nestjs/common'
import { IGetPaymentList, YooCheckoutService } from 'nestjs-yoocheckout'

@Injectable()
export class PaymentService {
	constructor(private readonly yooCheckoutService: YooCheckoutService) {}

	async getPaymentList() {
		const filters: IGetPaymentList = {
			created_at: {
				value: '2021-01-27T13:58:02.977Z',
				mode: 'gte'
			},
			limit: 20
		}

		const paymentList =
			await this.yooCheckoutService.getPaymentList(filters)
		return paymentList
	}
}
```
### [Get payment](https://yookassa.ru/developers/api#get_payment)

```typescript
import { Injectable } from '@nestjs/common'
import { YooCheckoutService } from 'nestjs-yoocheckout'

@Injectable()
export class PaymentService {
	constructor(private readonly yooCheckoutService: YooCheckoutService) {}

	async getPayment() {
		const paymentId = '21966b95-000f-50bf-b000-0d78983bb5bc'

		const payment = await this.yooCheckoutService.getPayment(paymentId)
		return payment
	}
}
```
### [Capture payment](https://yookassa.ru/developers/api#capture_payment)
```typescript
import { Injectable } from '@nestjs/common'
import { ICapturePayment, YooCheckoutService } from 'nestjs-yoocheckout'

@Injectable()
export class PaymentService {
	constructor(private readonly yooCheckoutService: YooCheckoutService) {}

	async capturePayment() {
		const paymentId = '21966b95-000f-50bf-b000-0d78983bb5bc'

		const capturePayload: ICapturePayment = {
			amount: {
				value: 100,
				currency: 'RUB'
			}
		}

		const payment = await this.yooCheckoutService.capturePayment(
			paymentId,
			capturePayload
		)
		return payment
	}
}
```
### [Cancel payment](https://yookassa.ru/developers/api#cancel_payment)
```typescript
import { Injectable } from '@nestjs/common'
import { YooCheckoutService } from 'nestjs-yoocheckout'

@Injectable()
export class PaymentService {
	constructor(private readonly yooCheckoutService: YooCheckoutService) {}

	async cancelPayment() {
		const paymentId = '21966b95-000f-50bf-b000-0d78983bb5bc'

		const payment = await this.yooCheckoutService.cancelPayment(paymentId)
		return payment
	}
}
```
### [Create refund](https://yookassa.ru/developers/api#create_refund)
```javascript
import { Injectable } from '@nestjs/common'
import { ICreateRefund, YooCheckoutService } from 'nestjs-yoocheckout'

@Injectable()
export class PaymentService {
	constructor(private readonly yooCheckoutService: YooCheckoutService) {}

	async createRefund() {
		const createRefundPayload: ICreateRefund = {
			payment_id: '27a3852a-000f-5000-8000-102d922df8db',
			amount: {
				value: 100,
				currency: 'RUB'
			}
		}

		const refund =
			await this.yooCheckoutService.createRefund(createRefundPayload)
		return refund
	}
}
```
### [Get refund](https://yookassa.ru/developers/api#get_refund)
```typescript
import { Injectable } from '@nestjs/common'
import { YooCheckoutService } from 'nestjs-yoocheckout'

@Injectable()
export class PaymentService {
	constructor(private readonly yooCheckoutService: YooCheckoutService) {}

	async getRefund() {
		const refundId = '21966b95-000f-50bf-b000-0d78983bb5bc'

		const refund = await this.yooCheckoutService.getRefund(refundId)
		return refund
	}
}
```
### [Get refund list](https://yookassa.ru/developers/api#get_refunds_list)
```typescript
import { Injectable } from '@nestjs/common'
import { IGetRefundList, YooCheckoutService } from 'nestjs-yoocheckout'

@Injectable()
export class PaymentService {
	constructor(private readonly yooCheckoutService: YooCheckoutService) {}

	async getRefundList() {
		const filters: IGetRefundList = {
			created_at: { value: '2021-01-27T13:58:02.977Z', mode: 'gte' },
			limit: 20
		}

		const refundList = await this.yooCheckoutService.getRefundList(filters)
		return refundList
	}
}
```
### [Create receipt](https://yookassa.ru/developers/api#create_receipt)
```typescript
import { Injectable } from '@nestjs/common'
import { ICreateReceipt, YooCheckoutService } from 'nestjs-yoocheckout'

@Injectable()
export class PaymentService {
	constructor(private readonly yooCheckoutService: YooCheckoutService) {}

	async createReceipt() {
		const createReceiptPayload: ICreateReceipt = {
			send: true,
			customer: {
				email: 'test@gmail.com'
			},
			settlements: [
				{
					type: 'cashless',
					amount: {
						value: 200,
						currency: 'RUB'
					}
				}
			],
			refund_id: '27a387af-0015-5000-8000-137da144ce29',
			type: 'refund',
			items: [
				{
					description: 'test',
					quantity: 2,
					amount: {
						value: 100,
						currency: 'RUB'
					},
					vat_code: 1
				}
			]
		}

		const receipt =
			await this.yooCheckoutService.createReceipt(createReceiptPayload)

		return receipt
	}
}
```
### [Get receipt](https://yookassa.ru/developers/api#get_receipt)
```typescript
import { Injectable } from '@nestjs/common'
import { YooCheckoutService } from 'nestjs-yoocheckout'

@Injectable()
export class PaymentService {
	constructor(private readonly yooCheckoutService: YooCheckoutService) {}

	async getReceipt() {
		const receiptId = '21966b95-000f-50bf-b000-0d78983bb5bc'

		const receipt = await this.yooCheckoutService.getReceipt(receiptId)

		return receipt
	}
}
```
### [Get receipt list](https://yookassa.ru/developers/api#get_receipts_list)
```typescript
import { Injectable } from '@nestjs/common'
import { IGetReceiptList, YooCheckoutService } from 'nestjs-yoocheckout'

@Injectable()
export class PaymentService {
	constructor(private readonly yooCheckoutService: YooCheckoutService) {}

	async getReceiptList() {
		const filters: IGetReceiptList = {
			created_at: { value: '2021-01-27T13:58:02.977Z', mode: 'gte' },
			limit: 20
		}

		const receiptList =
			await this.yooCheckoutService.getReceiptList(filters)

		return receiptList
	}
}
```
## A solution for receiving payment notifications. 
#### The restriction of allowed addresses can also be done through an nginx Proxy.

##### dto/payment-notification.dto

```typescript
import type { Payment } from 'nestjs-yoocheckout'

export class PaymentNotificationDto {
	event:
		| 'payment.succeeded'
		| 'payment.waiting_for_capture'
		| 'payment.canceled'
		| 'refund.succeeded'
	type: 'notification'
	object: Payment
}
```

##### payment.controller.ts
```typescript
import {
	Body,
	Controller,
	ForbiddenException,
	HttpCode,
	Post,
	Req
} from '@nestjs/common'
import type { Request } from 'express'
import { cidrSubnet } from 'ip'

import { PaymentNotificationDto } from './dto/payment-notification.dto'
import { PaymentService } from './payment.service'

const subnets = [
	'185.71.76.0/27',
	'185.71.77.0/27',
	'77.75.153.0/25',
	'77.75.154.128/25',
	'2a02:5180::/32'
]

@Controller('payment')
export class PaymentController {
	public constructor(private readonly paymentService: PaymentService) {}

	@HttpCode(200)
	@Post('notification')
	public async handleUpdate(
		@Req() req: Request,
		@Body() dto: PaymentNotificationDto
	) {
		const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for']

		if (
			ip &&
			(['77.75.156.11', '77.75.156.35'].includes(ip as string) ||
				subnets.some(subnet =>
					cidrSubnet(subnet).contains(ip as string)
				))
		) {
			return this.paymentService.handleUpdate(dto)
		}

		throw new ForbiddenException()
	}
}
```

##### payment.service
```typescript
import { Injectable } from '@nestjs/common'
import { YooCheckoutService } from 'nestjs-yoocheckout'

import { PaymentNotificationDto } from './dto/payment-notification.dto'

@Injectable()
export class PaymentService {
	public constructor(
		private readonly yookassaService: YooCheckoutService
	) {}

	public async handleUpdate(dto: PaymentNotificationDto) {
		const yooPaymentId = dto.object.id

    if (dto.event === 'payment.waiting_for_capture') {
			const payment = await this.yookassaService.getPayment(yooPaymentId)
			await this.yookassaService.capturePayment(yooPaymentId, {
				amount: payment.amount
			})

		}

		if (dto.event === 'payment.succeeded') {

		}

    if (dto.event === 'payment.canceled') {

		}

		if (dto.event === 'refund.succeeded') {
			
		}
	}
}

```

## You may want to transfer metadata. The following solution is available in this case

```typescript
import { Injectable } from '@nestjs/common'
import { ICreatePayment, YooCheckoutService } from 'nestjs-yoocheckout'

@Injectable()
export class PaymentService {
	constructor(private readonly yooCheckoutService: YooCheckoutService) {}

	async createPayment() {
		const paymentData: ICreatePayment = {
			amount: {
				value: 100,
				currency: 'RUB'
			},
			payment_method_data: {
				type: 'bank_card'
			},
			metadata: {
				payment_id: '21966b95-000f-50bf-b000-0d78983bb5bc',
				test: 'this_meta'
			},
			confirmation: {
				type: 'redirect',
				return_url: 'https://example.com/thanks'
			}
		}

		const newPayment =
			await this.yooCheckoutService.createPayment(paymentData)

		const { payment_id, test } = newPayment.metadata as {
			payment_id: string
			test: string
		}

		return newPayment
	}
}
```