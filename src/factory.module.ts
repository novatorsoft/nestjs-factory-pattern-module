import { DiscoveryModule, DiscoveryService, ModuleRef } from '@nestjs/core';

import { FactoryPatternConfig } from './config';
import { FactoryService } from './factory.service';
import { Module } from '@nestjs/common';

@Module({})
export class FactoryModule {
  static register({
    isGlobal,
    ...config
  }:
    | FactoryPatternConfig
    | {
        isGlobal?: boolean;
        configs: Array<Omit<FactoryPatternConfig, 'isGlobal'>>;
      }) {
    const configs = 'configs' in config ? config.configs : [config];
    return {
      module: FactoryModule,
      global: isGlobal,
      imports: [DiscoveryModule],
      providers: configs.map((nestedConfig: FactoryPatternConfig) => ({
        provide: nestedConfig.factoryName,
        useFactory: (
          moduleRef: ModuleRef,
          discoveryService: DiscoveryService,
        ) => {
          return new FactoryService(moduleRef, discoveryService, {
            ...nestedConfig,
            isGlobal,
          });
        },
        inject: [ModuleRef, DiscoveryService],
      })),
      exports: configs.map(
        (config: FactoryPatternConfig) => config.factoryName,
      ),
    };
  }
}
