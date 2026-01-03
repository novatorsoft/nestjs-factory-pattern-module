import { Injectable } from '@nestjs/common';

@Injectable()
export class FactoryNameGeneratorService {
  normalizeProviderName(input: string): string {
    if (!input || typeof input !== 'string')
      throw new Error('Input must be a non-empty string');

    let normalized = input
      .replace(/(Service|Provider|Factory|Handler|Manager)$/i, '')
      .trim();

    normalized = normalized
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
      .toLowerCase();

    normalized = normalized.replace(/[^a-z0-9_]/g, '_');

    normalized = normalized.replace(/_+/g, '_');
    normalized = normalized.replace(/^_+|_+$/g, '');

    if (!normalized)
      throw new Error(
        `Cannot generate factory name from input: ${input}. Result is empty.`,
      );

    return `${normalized}_PROVIDER`;
  }
}
