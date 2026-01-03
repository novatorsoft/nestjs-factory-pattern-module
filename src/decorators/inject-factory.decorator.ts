import { Inject } from '@nestjs/common';

export const InjectFactory = (factoryName: string) => Inject(factoryName);
