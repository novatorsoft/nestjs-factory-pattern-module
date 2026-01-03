import { FactoryProvider } from './factory-provider.decorator';
import faker from 'faker';

describe('FactoryProvider', () => {
  it('should be defined', () => {
    expect(FactoryProvider).toBeDefined();
    expect(typeof FactoryProvider).toBe('function');
  });

  it('should return a decorator function', () => {
    const factoryName = faker.lorem.word();
    const providerName = faker.lorem.word();
    const decorator = FactoryProvider(factoryName, providerName);
    expect(typeof decorator).toBe('function');
  });

  it('should set metadata with normalized factory name', () => {
    const factoryName = faker.lorem.word();
    const providerName = faker.lorem.word();

    const decorator = FactoryProvider(factoryName, providerName);
    class TestClass {}
    decorator(TestClass);

    const metadata = Reflect.getMetadata(
      `${factoryName}_FACTORY`,
      TestClass,
    ) as string;
    expect(metadata).toBe(providerName);
  });

  it('should handle different factory names', () => {
    const factoryName1 = faker.lorem.word();
    const factoryName2 = faker.lorem.word();
    const providerName1 = faker.lorem.word();
    const providerName2 = faker.lorem.word();

    class TestClass1 {}
    class TestClass2 {}

    const decorator1 = FactoryProvider(factoryName1, providerName1);
    const decorator2 = FactoryProvider(factoryName2, providerName2);

    decorator1(TestClass1);
    decorator2(TestClass2);

    expect(Reflect.getMetadata(`${factoryName1}_FACTORY`, TestClass1)).toBe(
      providerName1,
    );
    expect(Reflect.getMetadata(`${factoryName2}_FACTORY`, TestClass2)).toBe(
      providerName2,
    );
  });
});
