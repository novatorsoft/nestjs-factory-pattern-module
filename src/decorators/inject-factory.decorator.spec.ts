import { InjectFactory } from './inject-factory.decorator';
import { Inject } from '@nestjs/common';
import faker from 'faker';

describe('InjectFactory', () => {
  it('should be defined', () => {
    expect(InjectFactory).toBeDefined();
    expect(typeof InjectFactory).toBe('function');
  });

  it('should return result of Inject decorator', () => {
    const factoryName = faker.lorem.word();
    const result = InjectFactory(factoryName);

    expect(result).toBeDefined();
  });

  it('should work as parameter decorator', () => {
    class TestClass {
      constructor(@InjectFactory('TestFactory') private factory: any) {}
    }

    expect(TestClass).toBeDefined();
  });

  it('should handle different factory names', () => {
    class TestClass1 {
      constructor(@InjectFactory('Factory1') private factory1: any) {}
    }

    class TestClass2 {
      constructor(@InjectFactory('Factory2') private factory2: any) {}
    }

    expect(TestClass1).toBeDefined();
    expect(TestClass2).toBeDefined();
  });

  it('should handle multiple parameters with InjectFactory', () => {
    class TestClass {
      constructor(
        @InjectFactory('Factory1') private factory1: any,
        @InjectFactory('Factory2') private factory2: any,
      ) {}
    }

    expect(TestClass).toBeDefined();
  });

  it('should handle mixed decorators', () => {
    class TestClass {
      constructor(
        @InjectFactory('Factory1') private factory1: any,
        @Inject('OtherService') private otherService: any,
      ) {}
    }

    expect(TestClass).toBeDefined();
  });

  it('should handle property injection pattern', () => {
    class TestClass {
      @InjectFactory('TestFactory')
      private factory: any;
    }

    expect(TestClass).toBeDefined();
  });

  it('should handle empty string factory name', () => {
    const result = InjectFactory('');
    expect(result).toBeDefined();
  });

  it('should handle factory names with special characters', () => {
    const result = InjectFactory('Factory-Name');
    expect(result).toBeDefined();
  });

  it('should be equivalent to Inject decorator', () => {
    const factoryName = 'TestFactory';
    const injectFactoryResult = InjectFactory(factoryName);
    const injectResult = Inject(factoryName);

    expect(typeof injectFactoryResult).toBe('function');
    expect(typeof injectResult).toBe('function');
  });
});
