import { HttpModule } from '@nestjs/axios';
import { type DynamicModule, Global, Module } from '@nestjs/common';
import {
  type IYooCheckoutAsyncOptions,
  type IYooCheckoutOptions,
  YooCheckoutOptionsSymbol,
} from '../types';

import { YooCheckoutService } from './yoocheckout.service';

@Global()
@Module({})
export class YooCheckoutModule {
  /**
   * Метод для регистрации модуля с синхронными параметрами.
   * Этот метод используется для конфигурации модуля с заранее заданными параметрами.
   * @param {IYooCheckoutOptions} options - Настройки для конфигурации YooKassa.
   * @returns {DynamicModule} Возвращает динамический модуль с необходимыми провайдерами и импортами.
   *
   * @example
   * ```ts
   * YooCheckoutModule.forRoot({
   *   shopId: 'your_shop_id',
   *   apiKey: 'your_api_key',
   * });
   * ```
   */
  public static forRoot(options: IYooCheckoutOptions): DynamicModule {
    return {
      module: YooCheckoutModule,
      imports: [HttpModule],
      providers: [
        {
          provide: YooCheckoutOptionsSymbol,
          useValue: options,
        },
        YooCheckoutService,
      ],
      exports: [YooCheckoutService],
      global: true,
    };
  }

  /**
   * Метод для регистрации модуля с асинхронной конфигурацией.
   * Этот метод используется для конфигурации модуля с параметрами, которые будут переданы через фабричную функцию.
   * @param {YookassaAsyncOptions} options - Асинхронные параметры для конфигурации YooKassa.
   * @returns {DynamicModule} Возвращает динамический модуль с необходимыми провайдерами и импортами.
   *
   * @example
   * ```ts
   * YooCheckoutModule.forRootAsync({
   *   imports: [ConfigModule],
   *	  useFactory: async (configService: ConfigService) => ({
   *		 shopId: configService.getOrThrow('YOOKASSA_SHOP_ID'),
   *		 apiKey: configService.getOrThrow('YOOKASSA_API_KEY')
   *	  }),
   *	  inject: [ConfigService]
   * });
   * ```
   */
  public static forRootAsync(options: IYooCheckoutAsyncOptions): DynamicModule {
    return {
      module: YooCheckoutModule,
      imports: [HttpModule, ...(options.imports || [])],
      providers: [
        {
          provide: YooCheckoutOptionsSymbol,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        YooCheckoutService,
      ],
      exports: [YooCheckoutService],
      global: true,
    };
  }
}
