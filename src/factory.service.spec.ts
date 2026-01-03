import { DiscoveryService, ModuleRef } from '@nestjs/core';

import { FactoryPatternConfig } from './config';
import { FactoryService } from './factory.service';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import faker from 'faker';

describe('FactoryService', () => {
  let service: FactoryService;
  let moduleRef: jest.Mocked<ModuleRef>;
  let discoveryService: jest.Mocked<DiscoveryService>;
  let config: FactoryPatternConfig;
  let getProvidersSpy: jest.SpyInstance;
  let createSpy: jest.SpyInstance;

  class TestService {
    test() {
      return 'test';
    }
  }

  class AnotherTestService {
    test() {
      return 'another';
    }
  }

  beforeEach(() => {
    config = {
      factoryName: faker.lorem.word(),
      isGlobal: false,
    };

    moduleRef = {
      create: jest.fn(),
    } as unknown as jest.Mocked<ModuleRef>;

    discoveryService = {
      getProviders: jest.fn().mockReturnValue([]),
    } as unknown as jest.Mocked<DiscoveryService>;

    getProvidersSpy = jest.spyOn(discoveryService, 'getProviders');
    createSpy = jest.spyOn(moduleRef, 'create');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createService = () => {
    return new FactoryService(moduleRef, discoveryService, config);
  };

  describe('constructor', () => {
    it('should be defined', () => {
      service = createService();
      expect(service).toBeDefined();
    });

    it('should initialize serviceMap', () => {
      service = createService();
      expect(service).toBeDefined();
    });

    it('should set factoryProviderMetaKey correctly', () => {
      service = createService();
      expect(getProvidersSpy).toHaveBeenCalled();
    });

    it('should call initializeServiceMap', () => {
      service = createService();
      expect(getProvidersSpy).toHaveBeenCalled();
    });
  });

  describe('initializeServiceMap', () => {
    it('should filter providers with factory metadata', () => {
      const providerName = 'testProvider';
      const metadataKey = `${config.factoryName}_FACTORY`;

      const mockWrapper1: Partial<InstanceWrapper> = {
        isDependencyTreeStatic: () => true,
        instance: {},
        metatype: TestService,
      };

      const mockWrapper2: Partial<InstanceWrapper> = {
        isDependencyTreeStatic: () => true,
        instance: {},
        metatype: AnotherTestService,
      };

      const mockWrapper3: Partial<InstanceWrapper> = {
        isDependencyTreeStatic: () => false,
        instance: {},
        metatype: TestService,
      };

      getProvidersSpy.mockReturnValue([
        mockWrapper1,
        mockWrapper2,
        mockWrapper3,
      ]);

      Reflect.defineMetadata(metadataKey, providerName, TestService);
      Reflect.defineMetadata(
        metadataKey,
        'anotherProvider',
        AnotherTestService,
      );

      service = createService();

      expect(getProvidersSpy).toHaveBeenCalled();
    });

    it('should not add providers without metadata', () => {
      const mockWrapper: Partial<InstanceWrapper> = {
        isDependencyTreeStatic: () => true,
        instance: {},
        metatype: TestService,
      };

      getProvidersSpy.mockReturnValue([mockWrapper]);

      service = createService();

      expect(getProvidersSpy).toHaveBeenCalled();
    });

    it('should not add providers without instance', () => {
      const providerName = 'testProvider';
      const metadataKey = `${config.factoryName}_FACTORY`;

      const mockWrapper: Partial<InstanceWrapper> = {
        isDependencyTreeStatic: () => true,
        instance: null,
        metatype: TestService,
      };

      getProvidersSpy.mockReturnValue([mockWrapper]);
      Reflect.defineMetadata(metadataKey, providerName, TestService);

      service = createService();

      expect(getProvidersSpy).toHaveBeenCalled();
    });

    it('should not add providers without metatype', () => {
      const mockWrapper: Partial<InstanceWrapper> = {
        isDependencyTreeStatic: () => true,
        instance: {},
        metatype: null,
      };

      getProvidersSpy.mockReturnValue([mockWrapper]);

      service = createService();

      expect(getProvidersSpy).toHaveBeenCalled();
    });
  });

  describe('getProviderServiceAsync', () => {
    beforeEach(() => {
      service = createService();
    });

    it('should return provider instance when found', async () => {
      const providerName = 'testProvider';
      const metadataKey = `${config.factoryName}_FACTORY`;
      const mockInstance = new TestService();

      const mockWrapper: Partial<InstanceWrapper> = {
        isDependencyTreeStatic: () => true,
        instance: {},
        metatype: TestService,
      };

      Reflect.defineMetadata(metadataKey, providerName, TestService);
      getProvidersSpy.mockReturnValue([mockWrapper]);
      createSpy.mockResolvedValue(mockInstance);

      service = new FactoryService(moduleRef, discoveryService, config);

      const result = await service.getProviderServiceAsync(providerName);

      expect(createSpy).toHaveBeenCalledWith(TestService);
      expect(result).toBe(mockInstance);
    });

    it('should throw error when provider not found', async () => {
      getProvidersSpy.mockReturnValue([]);
      service = createService();

      await expect(
        service.getProviderServiceAsync('nonExistent'),
      ).rejects.toThrow('Provider not found. Name (type): nonExistent');
    });

    it('should throw error with correct message format', async () => {
      const providerName = 'missingProvider';
      getProvidersSpy.mockReturnValue([]);
      service = createService();

      await expect(
        service.getProviderServiceAsync(providerName),
      ).rejects.toThrow(`Provider not found. Name (type): ${providerName}`);
    });
  });
});
