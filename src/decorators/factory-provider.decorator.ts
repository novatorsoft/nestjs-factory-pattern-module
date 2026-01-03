import { FactoryNameGeneratorService } from '../factory-name-generator.service';
import { SetMetadata } from '@nestjs/common';

export const FactoryProvider = (factoryName: string, providerName: string) => {
  const factoryNameGeneratorService = new FactoryNameGeneratorService();
  return SetMetadata(
    factoryNameGeneratorService.normalizeProviderName(factoryName),
    providerName,
  );
};
