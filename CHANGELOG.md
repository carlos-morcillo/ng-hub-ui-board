# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [19.4.0] - 2026-01-17

### Added

-   Native drag-and-drop implementation without external dependencies (removed @angular/cdk dependency)
-   Custom drag preview templates via `CardDragPreviewDirective` and `ColumnDragPreviewDirective`
-   Custom placeholder templates via `CardPlaceholderDirective` and `ColumnPlaceholderDirective`
-   New `dragBehavior` input to control dragged element visibility: `'ghost'`, `'hide'`, or `'collapse'`
-   New `CardDragDropEvent` and `ColumnDragDropEvent` interfaces replacing CDK's CdkDragDrop
-   Custom drag-and-drop event models with complete type safety
-   Six new CSS custom properties for drag-and-drop customization (`--hub-drag-transition`, `--hub-placeholder-*`)

### Changed

-   Replaced Angular CDK drag-and-drop with custom native implementation
-   Updated all drag-and-drop event types from CDK to custom interfaces
-   Refactored component to use signals for column tracking with versioning
-   Enhanced board component with 621 new lines of drag-and-drop logic
-   Updated README with comprehensive documentation of new features, templates, and CSS variables

### Removed

-   Removed `@angular/cdk` peer dependency
-   Removed `predicate` property from `BoardColumn` interface (CDK-specific)

## [19.3.9] - 2026-01-16

### Fixed

-   Updated `publish:npm` and `pack` scripts in `package.json` to execute from the `dist/board` directory, ensuring published packages contain compiled artifacts instead of source code.

## [19.3.8] - 2026-01-16

### Fixed

-   Ensured correct publication of compiled artifacts by refining the release process.
-   Reverted `exports` configuration to maintain consistency with other libraries.

## [19.3.7] - 2026-01-16

### Fixed

-   Removed incorrect `!src/**/*` exclusion from `package.json` that was preventing CSS files from being included in the published package.

## [19.3.6] - 2026-01-16

### Fixed

-   Added `styles` export configuration in package.json to properly expose SCSS files.

## [19.3.5] - 2026-01-15

### Changed

-   Complete refactoring of board styling to use CSS variables for enhanced customization.
-   Documented all available CSS variables in README.
-   Added `StylingBoardExampleComponent` to showcase custom styling capabilities.

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
