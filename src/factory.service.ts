import { DiscoveryService, ModuleRef } from '@nestjs/core';
import { Injectable, Type } from '@nestjs/common';

import { FactoryNameGeneratorService } from './factory-name-generator.service';
import { FactoryPatternConfig } from './config';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

@Injectable()
export class FactoryService<T = unknown> {
  private readonly serviceMap: Map<string, Type<T>>;
  private readonly factoryProviderMetaKey: string;

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly discoveryService: DiscoveryService,
    private readonly factoryPatternConfig: FactoryPatternConfig,
    private readonly factoryNameGeneratorService: FactoryNameGeneratorService,
  ) {
    this.serviceMap = new Map<string, Type<T>>();
    this.factoryProviderMetaKey =
      this.factoryNameGeneratorService.normalizeProviderName(
        this.factoryPatternConfig.factoryName,
      );
    this.initializeServiceMap();
  }

  private initializeServiceMap(): void {
    const providers = this.discoveryService
      .getProviders()
      .filter(
        (wrapper) =>
          wrapper.isDependencyTreeStatic() &&
          wrapper.instance &&
          !!wrapper.metatype &&
          Reflect.getMetadata(this.factoryProviderMetaKey, wrapper.metatype),
      );

    this.setProviders(providers);
  }

  private setProviders(providers: InstanceWrapper[]): void {
    providers.forEach((provider) => {
      this.serviceMap.set(
        Reflect.getMetadata(
          this.factoryProviderMetaKey,
          provider.metatype as Type<T>,
        ) as string,
        provider.metatype as Type<T>,
      );
    });
  }

  async getProviderAsync(type: string): Promise<T> {
    const ServiceClass = this.serviceMap.get(type);
    if (!ServiceClass)
      throw new Error(`Provider not found. Name (type): ${type}`);
    return await this.moduleRef.create(ServiceClass);
  }
}
