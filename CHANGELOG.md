# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [19.3.1] - 2024-10-05

### Added
- Comprehensive JSDoc coverage across public models, directives, pipes, and the `HubBoardComponent` for improved API discoverability.
- New unit test ensuring the `reachedEnd` event is not emitted when column data is unavailable.

### Changed
- Refined infinite-scroll detection tolerance to ensure `reachedEnd` fires reliably at the bottom of each column.
- Hardened the document example logic to avoid duplicate lazy-load requests while columns are already loading.
- Typed the `invertColor` pipe output and improved error handling for invalid HEX values.

[19.3.1]: https://github.com/carlos-morcillo/ng-hub-ui-board/compare/19.3.0...19.3.1
