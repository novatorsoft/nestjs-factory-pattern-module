import { DiscoveryModule, DiscoveryService, ModuleRef } from '@nestjs/core';

import { FactoryModule } from './factory.module';
import { FactoryPatternConfig } from './config';
import { FactoryService } from './factory.service';

interface FactoryProvider {
  provide: string;
  useFactory: (
    moduleRef: ModuleRef,
    discoveryService: DiscoveryService,
  ) => FactoryService;
  inject: [typeof ModuleRef, typeof DiscoveryService];
}

describe('FactoryModule', () => {
  describe('register', () => {
    it('should return module configuration with single config', () => {
      const config: FactoryPatternConfig = {
        factoryName: 'TestFactory',
        isGlobal: false,
      };

      const result = FactoryModule.register(config);

      expect(result.module).toBe(FactoryModule);
      expect(result.global).toBe(false);
      expect(result.imports).toContain(DiscoveryModule);
      expect(result.providers).toBeDefined();
      expect(result.exports).toBeDefined();
    });

    it('should return module configuration with global flag', () => {
      const config: FactoryPatternConfig = {
        factoryName: 'TestFactory',
        isGlobal: true,
      };

      const result = FactoryModule.register(config);

      expect(result.module).toBe(FactoryModule);
      expect(result.global).toBe(true);
    });

    it('should create factory provider for single config', () => {
      const config: FactoryPatternConfig = {
        factoryName: 'TestFactory',
        isGlobal: false,
      };

      const result = FactoryModule.register(config);

      const factoryProviders = result.providers.filter(
        (p): p is FactoryProvider =>
          typeof p === 'object' &&
          p !== null &&
          'provide' in p &&
          (p as FactoryProvider).provide === 'TestFactory',
      );
      expect(factoryProviders.length).toBe(1);

      const factoryProvider = factoryProviders[0];
      expect(factoryProvider.provide).toBe('TestFactory');
      expect(factoryProvider.inject).toEqual([ModuleRef, DiscoveryService]);
    });

    it('should export factory name for single config', () => {
      const config: FactoryPatternConfig = {
        factoryName: 'TestFactory',
        isGlobal: false,
      };

      const result = FactoryModule.register(config);

      expect(result.exports).toContain('TestFactory');
    });

    it('should handle multiple configs object', () => {
      const configs = {
        isGlobal: false,
        configs: [
          { factoryName: 'Factory1' },
          { factoryName: 'Factory2' },
        ] as Array<Omit<FactoryPatternConfig, 'isGlobal'>>,
      };

      const result = FactoryModule.register(configs);

      expect(result.module).toBe(FactoryModule);
      expect(result.global).toBe(false);
      expect(result.providers.length).toBeGreaterThanOrEqual(1);
      expect(result.exports.length).toBeGreaterThanOrEqual(1);
    });

    it('should use factory function that creates FactoryService instance', () => {
      const config: FactoryPatternConfig = {
        factoryName: 'TestFactory',
        isGlobal: false,
      };

      const result = FactoryModule.register(config);
      const factoryProvider = result.providers.find(
        (p): p is FactoryProvider =>
          typeof p === 'object' &&
          p !== null &&
          'provide' in p &&
          (p as FactoryProvider).provide === 'TestFactory',
      );

      expect(factoryProvider?.useFactory).toBeDefined();
      expect(typeof factoryProvider?.useFactory).toBe('function');
    });

    it('should create FactoryService with correct dependencies', () => {
      const config: FactoryPatternConfig = {
        factoryName: 'TestFactory',
        isGlobal: false,
      };

      const result = FactoryModule.register(config);
      const factoryProvider = result.providers.find(
        (p): p is FactoryProvider =>
          typeof p === 'object' &&
          p !== null &&
          'provide' in p &&
          (p as FactoryProvider).provide === 'TestFactory',
      );

      const mockModuleRef = {
        create: jest.fn(),
      } as unknown as ModuleRef;
      const mockDiscoveryService = {
        getProviders: jest.fn().mockReturnValue([]),
      } as unknown as DiscoveryService;

      const factoryInstance = factoryProvider?.useFactory(
        mockModuleRef,
        mockDiscoveryService,
      );

      expect(factoryInstance).toBeInstanceOf(FactoryService);
    });

    it('should handle config with isGlobal undefined', () => {
      const config: FactoryPatternConfig = {
        factoryName: 'TestFactory',
      };

      const result = FactoryModule.register(config);

      expect(result.module).toBe(FactoryModule);
      expect(result.global).toBeUndefined();
    });

    it('should handle empty configs array', () => {
      const configs = {
        isGlobal: false,
        configs: [] as Array<Omit<FactoryPatternConfig, 'isGlobal'>>,
      };

      const result = FactoryModule.register(configs);

      expect(result.module).toBe(FactoryModule);
      expect(result.exports).toEqual([]);
    });

    it('should include DiscoveryModule in imports', () => {
      const config: FactoryPatternConfig = {
        factoryName: 'TestFactory',
        isGlobal: false,
      };

      const result = FactoryModule.register(config);

      expect(result.imports).toContain(DiscoveryModule);
      expect(result.imports.length).toBe(1);
    });
  });
});
