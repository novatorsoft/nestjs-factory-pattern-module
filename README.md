<p align="center"><a href="https://novatorsoft.com" target="_blank"><img src="https://os.novatorsoft.com/novatorsoft/dark-logo.png" width="700" alt="Novatorsoft Logo"/></a></p>

<h1 align="center">NestJS Factory Pattern Module</h1>
<p align="center">A NestJS factory-pattern module that provides a provider-discovery and resolution abstraction for building pluggable, type-based service architectures.</p>

<p align="center">
     <a href="https://sonarcloud.io/summary/overall?id=novatorsoft_nestjs-factory-pattern-module" target="_blank"><img src="https://sonarcloud.io/api/project_badges/measure?project=novatorsoft_nestjs-factory-pattern-module&metric=alert_status"/></a>
     <a href="https://sonarcloud.io/summary/overall?id=novatorsoft_nestjs-factory-pattern-module" target="_blank"><img src="https://sonarcloud.io/api/project_badges/measure?project=novatorsoft_nestjs-factory-pattern-module&metric=coverage"/></a>
     <a href="https://www.npmjs.com/package/nestjs-factory-pattern-module" target="_blank"><img src="https://img.shields.io/npm/v/nestjs-factory-pattern-module.svg" alt="NPM Version" /></a>
     <a href="https://www.npmjs.com/package/nestjs-factory-pattern-module" target="_blank"><img src="https://img.shields.io/npm/l/nestjs-factory-pattern-module.svg" alt="Package License" /></a>
     <a href="https://www.npmjs.com/package/nestjs-factory-pattern-module" target="_blank"><img src="https://img.shields.io/npm/dm/nestjs-factory-pattern-module.svg" alt="NPM Downloads" /></a>
</p>
<p align="center">
     <a href="https://www.instagram.com/novatorsoft/" target="_blank"><img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" /></a>
     <a href="https://www.linkedin.com/company/novatorsoft/" target="_blank"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
</p>

## About

`nestjs-factory-pattern-module` helps you standardize “strategy/provider selection” in NestJS by letting you register multiple provider implementations and resolve the correct one at runtime using a simple factory token + provider name (type). It leverages NestJS `DiscoveryService` and a `@FactoryProvider(...)` decorator to discover providers automatically, then exposes a `FactoryService` (via `FactoryModule.register(...)`) to instantiate the right provider on demand—making extensible modules (exports, notifications, payments, etc.) cleaner and easier to scale.

## Documentation

For installation, usage, configuration, and examples, see the documentation:
- [Documentation](https://opensource.novatorsoft.com/docs/nestjs-factory-pattern-module/intro)

## License
MIT — see [LICENSE](./LICENSE).
