import { DiscoveryService } from '@nestjs/core';
import { FactoryNameGeneratorService } from './factory-name-generator.service';
import { FactoryPatternConfig } from './config';
import { FactoryService } from './factory.service';
import { Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

@Module({})
export class FactoryModule {
  static register(config: FactoryPatternConfig) {
    return {
      module: FactoryModule,
      global: config.isGlobal,
      providers: [
        FactoryNameGeneratorService,
        {
          provide: config.factoryName,
          useFactory: (
            moduleRef: ModuleRef,
            discoveryService: DiscoveryService,
            factoryNameGeneratorService: FactoryNameGeneratorService,
          ) => {
            return new FactoryService(
              moduleRef,
              discoveryService,
              config,
              factoryNameGeneratorService,
            );
          },
          inject: [ModuleRef, DiscoveryService, FactoryNameGeneratorService],
        },
      ],
      exports: [config.factoryName],
    };
  }
}
