import { SetMetadata } from '@nestjs/common';

export const FactoryProvider = (factoryName: string, providerName: string) =>
  SetMetadata(`${factoryName}_FACTORY`, providerName);
