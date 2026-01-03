import { DiscoveryModule, DiscoveryService } from '@nestjs/core';

import { FactoryNameGeneratorService } from './factory-name-generator.service';
import { FactoryPatternConfig } from './config';
import { FactoryService } from './factory.service';
import { Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

@Module({})
export class FactoryModule {
  static register(
    config:
      | FactoryPatternConfig
      | {
          isGlobal?: boolean;
          configs: Array<Omit<FactoryPatternConfig, 'isGlobal'>>;
        },
  ) {
    const configs = Array.isArray(config) ? config : [config];
    return {
      module: FactoryModule,
      global: config.isGlobal,
      imports: [DiscoveryModule],
      providers: [
        FactoryNameGeneratorService,
        ...configs.map((nestedConfig: FactoryPatternConfig) => ({
          provide: nestedConfig.factoryName,
          useFactory: (
            moduleRef: ModuleRef,
            discoveryService: DiscoveryService,
            factoryNameGeneratorService: FactoryNameGeneratorService,
          ) => {
            return new FactoryService(
              moduleRef,
              discoveryService,
              nestedConfig,
              factoryNameGeneratorService,
            );
          },
          inject: [ModuleRef, DiscoveryService, FactoryNameGeneratorService],
        })),
      ],
      exports: [
        ...configs.map((config: FactoryPatternConfig) => config.factoryName),
      ],
    };
  }
}
