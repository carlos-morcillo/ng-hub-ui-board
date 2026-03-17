# Breaking Changes in `ng-hub-ui-board`

This document details the breaking changes introduced in major versions of `ng-hub-ui-board` and how to migrate your codebase.

## Version 21.1.0

### Removal of Public SCSS Entry Point

The standalone file `src/lib/styles/board.scss` has been removed. Styles are now strictly encapsulated within the `HubBoardComponent` via `board.component.scss`.

**Migration Steps:**

1.  **Remove manual style imports:** If you were importing the stylesheet manually in your global `styles.scss`, remove the following line:

    ```scss
    @use 'ng-hub-ui-board/src/lib/styles/board.scss';
    ```

2.  **Automatic Styling:** The component now handles its own styles. Ensure your build pipeline correctly processes component-level SCSS.

3.  **Global Overrides:** If you need to override component styles globally, you should now use CSS custom properties (variables) or target the `.hub-board` class directly (using `:deep` or global selectors if necessary, though CSS variables are the recommended approach).

## Version 21.0.0

### CSS Variables Prefix Standardization

To maintain consistency across the entire `ng-hub-ui` ecosystem, all CSS variables for the board component have been refactored.
The legacy `--hub-` prefix for component variables has been updated to include the component namespace: `--hub-board-`.

**Migration Steps:**
Find and replace usages of the old CSS variables with the new ones. For example:

- Replace `--hub-column-bg` with `--hub-board-column-bg`
- Replace `--hub-card-bg` with `--hub-board-card-bg`
- Replace `--hub-card-border-radius` with `--hub-board-card-border-radius`

For a complete and up-to-date token catalog, please refer to the main CSS Variables Reference document.

### Stylesheet Import Renamed

The base stylesheet import has been renamed to better reflect its association with the component.

**Migration Steps:**
Update your global `styles.scss` (or component specific SCSS files) depending on this component:

**Before:**

```scss
@use 'ng-hub-ui-board/src/lib/styles/base.scss';
```

**After:**

```scss
@use 'ng-hub-ui-board/src/lib/styles/board.scss';
```
