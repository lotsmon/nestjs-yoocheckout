import type { FactoryProvider, ModuleMetadata } from '@nestjs/common';

export const YooCheckoutOptionsSymbol = Symbol();

export interface IYooCheckoutOptions {
  /**
   * Идентификатор магазина в YooKassa.
   */
  shopId: string;
  /**
   * Ключ API для аутентификации в YooKassa.
   */
  apiKey: string;
}

export type IYooCheckoutAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<IYooCheckoutOptions>, 'useFactory' | 'inject'>;
