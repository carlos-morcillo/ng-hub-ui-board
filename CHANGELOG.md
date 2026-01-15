# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [19.3.4] - 2026-01-15

### Changed

-   Complete refactoring of board styling to use CSS variables for enhanced customization.
-   Documented all available CSS variables in README.
-   Added `StylingBoardExampleComponent` to showcase custom styling capabilities.

## [19.3.3] - 2026-01-15

### Changed

-   Complete refactoring of board styling to use CSS variables for enhanced customization.
-   Documented all available CSS variables in README.
-   Added `StylingBoardExampleComponent` to showcase custom styling capabilities.

## [19.3.2] - 2025-01-15

### Changed

-   Improved `reachedEnd` event documentation in README with correct usage examples showing `event.data` as the complete `BoardColumn` object
-   Updated `reachedEnd` event example to include proper container with fixed height requirement for scroll detection
-   Enhanced license section in README with detailed explanation of CC BY 4.0 permissions, requirements, and attribution example

### Fixed

-   Corrected misleading `reachedEnd` event documentation that incorrectly showed direct access to `event.data.title` instead of extracting the column first

## [19.3.1] - 2024-10-05

### Added

-   Comprehensive JSDoc coverage across public models, directives, pipes, and the `HubBoardComponent` for improved API discoverability.
-   New unit test ensuring the `reachedEnd` event is not emitted when column data is unavailable.

### Changed

-   Refined infinite-scroll detection tolerance to ensure `reachedEnd` fires reliably at the bottom of each column.
-   Hardened the document example logic to avoid duplicate lazy-load requests while columns are already loading.
-   Typed the `invertColor` pipe output and improved error handling for invalid HEX values.

[19.3.1]: https://github.com/carlos-morcillo/ng-hub-ui-board/compare/19.3.0...19.3.1
