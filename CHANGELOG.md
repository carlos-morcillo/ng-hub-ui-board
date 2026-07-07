# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [22.3.0] - 2026-07-07

### Changed

- **BREAKING (packaging) — SCSS ships at `ng-hub-ui-board/styles`.** The theme mixin now builds to `dist/board/styles/...` (was `dist/board/src/lib/styles/...`), so `@use 'ng-hub-ui-board/styles'` resolves. Update any `@use` that reached into `src/lib/styles`.

- **`<hub-board>` `variant` accepts ANY colour.** On top of the built-in semantic accents, the input now also accepts a **registered custom accent** and a **literal colour** (`#ff0000`, `rgb(...)`, `oklch(...)`, a CSS named colour), resolved through the shared `resolveHubAccent` helper (imported from `ng-hub-ui-utils`): a bareword becomes `var(--hub-sys-color-<name>, <name>)`; a literal is used as-is. The single `--hub-<comp>-accent` slot derives the rest of the family, so built-in colours are unchanged.
- **Internal — host bindings moved to the `host` metadata object.** `@HostBinding` / `@HostListener` decorators were replaced by the `host` object in the component/directive metadata (Angular style guide). No public API or behaviour change.

## [22.2.1] - 2026-07-02

### Fixed

- Docs: `docs/css-variables-reference.md` default values resynchronized with the actual code declarations (now guarded by the repo-level `tokens-parity` check F).

## [22.2.0] - 2026-06-26

### Changed

- **Accent system migrated to the open-set "local accent slot" pattern.** `<hub-board variant="…">` now re-bases a single `--hub-board-accent` slot, and the role family — `--hub-board-accent-emphasis`, `--hub-board-accent-subtle` and the new `--hub-board-accent-on` (contrast colour) — is derived **locally** from it with `color-mix(in oklch, …)` / relative color, mirroring the `ng-hub-ui-ds` engine. The built-in variant list grew from 5 to the **nine canonical accents** (`primary · secondary · success · danger · warning · info · neutral · light · dark`), and a bare `[data-variant]` block re-derives the family from the slot so **any custom accent** the host app adds to the ds `$hub-accents` map (e.g. `brand`) recolours the drag/drop placeholder at runtime with one CSS rule — no library recompilation.

### Added

- New tokens `--hub-board-accent-on` (grayscale contrast flip driven by the accent's own lightness) and `--hub-board-accent-emphasis`.

### Fixed

- Migrated the accent `color-mix()` derivation (`--hub-board-accent-subtle`) from the `srgb` colour space to `oklch` for perceptually uniform tints, matching `ng-hub-ui-ds`. The subtle tint is now derived at 12% (was 8%).

## [22.1.1] - 2026-06-25

### Fixed

- Design-token consistency pass: aligned inline fallback defaults with the canonical `ng-hub-ui-ds` values and routed hardcoded literals (z-index, font-weight, line-height, radii and theme-aware colours) through their `--hub-sys-*` / `--hub-ref-*` tokens, so they follow the active theme. No visual change when the ds tokens are loaded.

## [22.1.0] - 2026-06-24

### Changed

- **Drag-and-drop internals now consume the shared `ng-hub-ui-utils` native drag-and-drop core.** The board's `moveItemInArray` / `transferArrayItem` helpers (still re-exported from the public API with unchanged behaviour) and the custom drag-preview rendering now come from `ng-hub-ui-utils`, removing duplicated logic. **New peer dependency: `ng-hub-ui-utils` (>=22.1.0)** — previously the board carried no ng-hub-ui dependencies, so install `ng-hub-ui-utils` alongside `ng-hub-ui-board`.

### Added

- New `variant` input on `<hub-board>` selecting the **semantic accent** of the drag/drop placeholder: `<hub-board variant="success">` recolours the drop zone. The built-in variants (`primary` / `success` / `danger` / `warning` / `info`) use the exact design-system tints; **any other string is also accepted** — the board reads `--hub-sys-color-<variant>` from the host application. Defaults to `primary`. Mirrors the accent system in panels/nav.
- New tokens `--hub-board-accent` and `--hub-board-accent-subtle` (the placeholder's `--hub-board-placeholder-border-color` / `-bg` now resolve through them instead of being hard-wired to `--hub-sys-color-primary*`). No visual change with the default accent.
- New **`hub-board-theme()` Sass mixin** (`styles/mixins/board-theme`) — theme a `<hub-board>` in one call: accent, container/column/card colours, borders/radius, columns gap, card padding & shadow. Every parameter is optional and defaults to `null`, so only the ones you pass are emitted as `--hub-board-*` overrides; the rest keep their defaults. Token-based, no Bootstrap dependency.

## [22.0.0] - 2026-06-17

### Changed

- Aligned with Angular 22.
- README documentation standardized.


## [21.1.2] - 2026-06-14

### Changed

- Replaced the deprecated `ngStyle` directive with the native `[style]` binding on board columns and cards (Angular soft-deprecated `ngStyle`/`ngClass` in November 2024 in favour of native bindings, for better performance and smaller bundles).

## [21.1.1] - 2026-04-14

### Fixed

- Corrected `mousedown` expression on disabled cards: replaced `card.disabled && $event.stopPropagation()` with `card.disabled ? $event.stopPropagation() : null` for correct template evaluation.

### Documentation

- Updated `README.md` with Hub UI live documentation links, language toggle, and complete `ng-hub-ui` family list.
- Added `README.es.md` (Spanish translation).

## [21.1.0] - 2026-03-17

### Changed

- **BREAKING CHANGE:** Removed `src/lib/styles/board.scss`. Styles are now encapsulated within `HubBoardComponent` via `board.component.scss`.
- Refactored internal styling structure for better component encapsulation.
- Improved test robustness and hardened directive specs.

## [21.0.0] - 2026-03-09

### Changed

- **BREAKING CHANGE:** Completely refactored the SCSS variable names to ensure they follow the `hub-board-` prefix standard. `base.scss` has been renamed to `board.scss`. Check `BREAKING_CHANGES.md` for migration guidelines.

## [19.4.0] - 2026-01-17

### Added

- Native drag-and-drop implementation without external dependencies (removed @angular/cdk dependency)
- Custom drag preview templates via `CardDragPreviewDirective` and `ColumnDragPreviewDirective`
- Custom placeholder templates via `CardPlaceholderDirective` and `ColumnPlaceholderDirective`
- New `dragBehavior` input to control dragged element visibility: `'ghost'`, `'hide'`, or `'collapse'`
- New `CardDragDropEvent` and `ColumnDragDropEvent` interfaces replacing CDK's CdkDragDrop
- Custom drag-and-drop event models with complete type safety
- Six new CSS custom properties for drag-and-drop customization (`--hub-drag-transition`, `--hub-placeholder-*`)

### Changed

- Replaced Angular CDK drag-and-drop with custom native implementation
- Updated all drag-and-drop event types from CDK to custom interfaces
- Refactored component to use signals for column tracking with versioning
- Enhanced board component with 621 new lines of drag-and-drop logic
- Updated README with comprehensive documentation of new features, templates, and CSS variables

### Removed

- Removed `@angular/cdk` peer dependency
- Removed `predicate` property from `BoardColumn` interface (CDK-specific)

## [19.3.9] - 2026-01-16

### Fixed

- Updated `publish:npm` and `pack` scripts in `package.json` to execute from the `dist/board` directory, ensuring published packages contain compiled artifacts instead of source code.

## [19.3.8] - 2026-01-16

### Fixed

- Ensured correct publication of compiled artifacts by refining the release process.
- Reverted `exports` configuration to maintain consistency with other libraries.

## [19.3.7] - 2026-01-16

### Fixed

- Removed incorrect `!src/**/*` exclusion from `package.json` that was preventing CSS files from being included in the published package.

## [19.3.6] - 2026-01-16

### Fixed

- Added `styles` export configuration in package.json to properly expose SCSS files.

## [19.3.5] - 2026-01-15

### Changed

- Complete refactoring of board styling to use CSS variables for enhanced customization.
- Documented all available CSS variables in README.
- Added `StylingBoardExampleComponent` to showcase custom styling capabilities.

## [19.3.4] - 2026-01-15

### Changed

- Complete refactoring of board styling to use CSS variables for enhanced customization.
- Documented all available CSS variables in README.
- Added `StylingBoardExampleComponent` to showcase custom styling capabilities.

## [19.3.3] - 2026-01-15

### Changed

- Complete refactoring of board styling to use CSS variables for enhanced customization.
- Documented all available CSS variables in README.
- Added `StylingBoardExampleComponent` to showcase custom styling capabilities.

## [19.3.2] - 2025-01-15

### Changed

- Improved `reachedEnd` event documentation in README with correct usage examples showing `event.data` as the complete `BoardColumn` object
- Updated `reachedEnd` event example to include proper container with fixed height requirement for scroll detection
- Enhanced license section in README with detailed explanation of CC BY 4.0 permissions, requirements, and attribution example

### Fixed

- Corrected misleading `reachedEnd` event documentation that incorrectly showed direct access to `event.data.title` instead of extracting the column first

## [19.3.1] - 2024-10-05

### Added

- Comprehensive JSDoc coverage across public models, directives, pipes, and the `HubBoardComponent` for improved API discoverability.
- New unit test ensuring the `reachedEnd` event is not emitted when column data is unavailable.

### Changed

- Refined infinite-scroll detection tolerance to ensure `reachedEnd` fires reliably at the bottom of each column.
- Hardened the document example logic to avoid duplicate lazy-load requests while columns are already loading.
- Typed the `invertColor` pipe output and improved error handling for invalid HEX values.

[19.3.1]: https://github.com/carlos-morcillo/ng-hub-ui-board/compare/19.3.0...19.3.1
