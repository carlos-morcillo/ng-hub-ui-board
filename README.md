# ng-hub-ui-board

[![npm version](https://badge.fury.io/js/ng-hub-ui-board.svg)](https://badge.fury.io/js/ng-hub-ui-board)

> **⚠️ CRITICAL (MAJOR RELEASE):** Version 21.0.0 introduces structural breaking changes to CSS variables and stylesheet imports. Please read the [BREAKING_CHANGES.md](./BREAKING_CHANGES.md) file before upgrading.

## Part of ng-hub-ui Family

This component is part of the ng-hub-ui ecosystem, which includes:

- [ng-hub-ui-paginable](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [ng-hub-ui-modal](https://www.npmjs.com/package/ng-hub-ui-modal)
- [ng-hub-ui-stepper](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [ng-hub-ui-breadcrumbs](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [ng-hub-ui-portal](https://www.npmjs.com/package/ng-hub-ui-portal)
- [ng-hub-ui-avatar](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [ng-hub-ui-accordion](https://www.npmjs.com/package/ng-hub-ui-accordion)

## Description

A flexible and powerful board component for Angular applications, perfect for implementing Kanban-style boards, task management systems, or any drag-and-drop card-based interface. Similar to Trello boards, this component allows you to create interactive columns with draggable cards.

## Features

- 🎯 **Standalone component** - Modern Angular approach with minimal setup
- 🔄 **Native drag and drop** - Custom implementation without external dependencies (no CDK required)
- 🎨 **Fully customizable drag visuals** - Custom templates for drag previews and drop placeholders
- ⚙️ **Configurable drag behavior** - Choose between ghost, hide, or collapse modes for dragged elements
- 📱 **Responsive design** - Works seamlessly across desktop, tablet, and mobile devices
- 🎭 **Highly customizable** - Custom templates for cards, headers, footers, and drag interactions
- 🔧 **Bootstrap compatible** - Integrates perfectly with Bootstrap 5 design system
- ⚡ **Virtual scrolling** - Supports infinite scroll with end-detection for performance
- 🎨 **Custom styling** - CSS custom properties for easy theming and customization
- 🔒 **Granular control** - Enable/disable functionality at board, column, or card level
- 🏷️ **TypeScript support** - Full type safety with generic interfaces
- ♿ **Accessibility ready** - Follows WAI-ARIA best practices for drag-and-drop
- 🪶 **Lightweight** - Zero external UI dependencies

## Installation

```bash
# Install the component
npm install ng-hub-ui-board
```

Or using yarn:

```bash
yarn add ng-hub-ui-board
```

**Note:** Starting from version 19.4.0, `@angular/cdk` is no longer required. The component now includes its own native drag-and-drop implementation.

## Quick Start

Here’s a quick example to get you started with `ng-hub-ui-board` using the standalone component approach.

### 1. Setup your board model

```ts
import { signal } from '@angular/core';
import { Board } from 'ng-hub-ui-board';

export const board = signal<Board>({
	title: 'Project Sprint',
	columns: [
		{
			title: 'To Do',
			cards: [
				{ title: 'Login page', description: 'Build login form with validation' },
				{ title: 'Landing hero', description: 'Implement hero section' }
			]
		},
		{
			title: 'In Progress',
			cards: [{ title: 'Set up CI/CD', description: 'Add GitHub Actions' }]
		},
		{
			title: 'Done',
			cards: [{ title: 'Project scaffold', description: 'Initial Angular setup' }]
		}
	]
});
```

### 2. Create your component

```ts
import { Component } from '@angular/core';
import {
	HubBoardComponent,
	CardTemplateDirective,
	BoardColumnHeaderDirective,
	BoardColumnFooterDirective,
	BoardCard
} from 'ng-hub-ui-board';

@Component({
	selector: 'board-demo',
	standalone: true,
	imports: [HubBoardComponent, CardTemplateDirective, BoardColumnHeaderDirective, BoardColumnFooterDirective],
	templateUrl: './board-demo.component.html'
})
export class BoardDemoComponent {
	board = board;

	handleCardClick(card: BoardCard) {
		console.log('Card clicked:', card);
	}

	handleCardMoved(event: any) {
		console.log('Card moved:', event);
	}
}
```

### 3. Use in your template

```html
<hub-board [board]="board()" (onCardClick)="handleCardClick($event)" (onCardMoved)="handleCardMoved($event)">
	<ng-template cardTpt let-card="item">
		<strong>{{ card.title }}</strong>
		<p>{{ card.description }}</p>
	</ng-template>
</hub-board>
```

This code block provides a minimal and functional example for both beginners and intermediate users.

## Usage

The component can be used in two ways:

### 1. Standalone Component Import (Recommended)

```typescript
import { Component } from '@angular/core';
import {
	HubBoardComponent,
	CardTemplateDirective,
	BoardColumnHeaderDirective,
	BoardColumnFooterDirective
} from 'ng-hub-ui-board';

@Component({
	selector: 'app-my-component',
	standalone: true,
	imports: [HubBoardComponent, CardTemplateDirective, BoardColumnHeaderDirective, BoardColumnFooterDirective],
	template: `
		<hub-board [board]="board" (onCardClick)="handleCardClick($event)" (onCardMoved)="handleCardMoved($event)">
			<!-- Templates go here -->
		</hub-board>
	`
})
export class MyComponent {
	// ... component logic
}
```

### 2. Module Import (Legacy)

```typescript
import { NgModule } from '@angular/core';
import { BoardModule } from 'ng-hub-ui-board';

@NgModule({
	imports: [BoardModule]
	// ... rest of the module configuration
})
export class AppModule {}
```

## Templates

The component uses multiple templates for customization. If you're using the standalone approach, remember to import the corresponding directives for each template you plan to use.

### Standard Templates

### Card Template (CardTemplateDirective)

Used to customize how each card is rendered within the columns. This template gives you complete control over the card's appearance and structure.

```html
<ng-template cardTpt let-card="card">
	<div class="custom-card">
		<h3>{{ card.title }}</h3>
		<p>{{ card.description }}</p>
		<div class="card-metadata">
			<span class="priority">{{ card.data?.priority }}</span>
			<span class="due-date">{{ card.data?.dueDate | date }}</span>
		</div>
	</div>
</ng-template>
```

### Column Header Template (BoardColumnHeaderDirective)

Used to customize the header of each column. Perfect for adding column-specific actions, showing card counts, or adding filtering options.

```html
<ng-template columnHeaderTpt let-column="column">
	<div class="custom-header">
		<h2>{{ column.title }}</h2>
		<span class="card-count">{{ column.cards.length }} items</span>
		<div class="column-actions">
			<button (click)="addCard(column)">Add Card</button>
			<button (click)="filterColumn(column)">Filter</button>
		</div>
	</div>
</ng-template>
```

### Column Footer Template (BoardColumnFooterDirective)

Used to add a footer to each column. Useful for summary information, quick actions, or column-specific controls.

```html
<ng-template columnFooterTpt let-column="column">
	<div class="custom-footer">
		<div class="column-summary">
			<span>Total: {{ column.cards.length }}</span>
			<span>Priority Items: {{ getPriorityItems(column) }}</span>
		</div>
		<button (click)="quickAddCard(column)">Quick Add</button>
	</div>
</ng-template>
```

### Drag-and-Drop Templates

#### Card Drag Preview Template (CardDragPreviewDirective)

Customize the visual element that follows the cursor when dragging cards. The template receives the dragged card and its source column as context.

```html
<ng-template cardDragPreview let-card="card" let-column="column">
	<div class="custom-drag-preview">
		<div class="preview-header">
			<span class="badge">{{ column.title }}</span>
		</div>
		<h4>{{ card.title }}</h4>
		<p class="preview-description">{{ card.description }}</p>
	</div>
</ng-template>
```

**Context variables:**

- `card`: The card being dragged
- `column`: The source column of the card

#### Card Placeholder Template (CardPlaceholderDirective)

Customize the drop zone appearance when dragging cards between or within columns.

```html
<ng-template cardPlaceholder>
	<div class="custom-card-placeholder">
		<span class="placeholder-icon">📥</span>
		<p>Drop card here</p>
	</div>
</ng-template>
```

#### Column Drag Preview Template (ColumnDragPreviewDirective)

Customize the visual element that follows the cursor when dragging columns. The template receives the dragged column as context.

```html
<ng-template columnDragPreview let-column="column">
	<div class="custom-column-preview">
		<h3>{{ column.title }}</h3>
		<span class="card-count">{{ column.cards.length }} cards</span>
	</div>
</ng-template>
```

**Context variable:**

- `column`: The column being dragged

#### Column Placeholder Template (ColumnPlaceholderDirective)

Customize the drop zone appearance when reordering columns.

```html
<ng-template columnPlaceholder>
	<div class="custom-column-placeholder">
		<span class="placeholder-text">Drop column here</span>
	</div>
</ng-template>
```

## Events

The `HubBoardComponent` emits several events to help you interact with user actions such as clicking cards, moving items, or reaching scroll limits.

### onCardClick

Emitted when a card is clicked.

```html
<hub-board [board]="board" (onCardClick)="handleCardClick($event)"> </hub-board>
```

**Type:** `EventEmitter<BoardCard>`

**Example:**

```ts
handleCardClick(card: BoardCard) {
  console.log('Card clicked:', card.title);
}
```

---

### onCardMoved

Emitted when a card is moved either within the same column or between columns.

```html
<hub-board [board]="board" (onCardMoved)="handleCardMoved($event)"> </hub-board>
```

**Type:** `EventEmitter<CardDragDropEvent>`

**Example:**

```ts
import { CardDragDropEvent } from 'ng-hub-ui-board';

handleCardMoved(event: CardDragDropEvent) {
  const card = event.item.data;
  const from = event.previousContainer.data;
  const to = event.container.data;

  console.log(`Moved "${card.title}" from "${from.title}" to "${to.title}"`);
}
```

---

### onColumnMoved

Emitted when a column is reordered via drag and drop.

```html
<hub-board [board]="board" (onColumnMoved)="handleColumnMoved($event)"> </hub-board>
```

**Type:** `EventEmitter<ColumnDragDropEvent>`

**Example:**

```ts
import { ColumnDragDropEvent } from 'ng-hub-ui-board';

handleColumnMoved(event: ColumnDragDropEvent) {
  console.log(`Column moved from ${event.previousIndex} to ${event.currentIndex}`);
}
```

---

### reachedEnd

Emitted when a user scrolls to the end of a column. Useful for triggering lazy-loading of additional cards.

```html
<div style="height: 512px;">
	<hub-board [board]="board" (reachedEnd)="loadMoreCards($event)"></hub-board>
</div>
```

**Type:** `EventEmitter<ReachedEndEvent<BoardColumn>>`

**Event Structure:**

```typescript
interface ReachedEndEvent<T = any> {
	index: number; // Index of the column that reached the end
	data: T; // The BoardColumn object itself
}
```

**Example:**

```ts
loadMoreCards(event: ReachedEndEvent) {
  const columnIndex = event.index;
  const column = event.data;  // event.data is the BoardColumn object

  if (!column) {
    return;
  }

  console.log(`Loading more cards for column: ${column.title}`);

  // Simulate API call to load more cards
  setTimeout(() => {
    const newCards = this.generateCards(5);

    // Update the board with new cards
    this.board.update(currentBoard => ({
      ...currentBoard,
      columns: currentBoard.columns?.map((col, index) =>
        index === columnIndex
          ? { ...col, cards: [...col.cards, ...newCards] }
          : col
      ) || []
    }));
  }, 1000);
}
```

> ℹ️ **Important:** To enable scroll detection, the board must be placed inside a container with a fixed height constraint.

## Inputs

The following inputs are available on the `HubBoardComponent`:

| Input                   | Type            | Description                                                                                            | Default      |
| ----------------------- | --------------- | ------------------------------------------------------------------------------------------------------ | ------------ |
| `board`                 | `Signal<Board>` | The board object containing columns and cards                                                          | `undefined`  |
| `columnSortingDisabled` | `boolean`       | Disables drag-and-drop sorting of columns                                                              | `false`      |
| `dragBehavior`          | `DragBehavior`  | Controls how dragged elements behave visually: `'ghost'` (semi-transparent), `'hide'`, or `'collapse'` | `'collapse'` |

## Outputs

These outputs are emitted by the component during user interaction:

| Output          | Type                                | Description                                                               |
| --------------- | ----------------------------------- | ------------------------------------------------------------------------- |
| `onCardClick`   | `EventEmitter<BoardCard>`           | Triggered when a card is clicked                                          |
| `onCardMoved`   | `EventEmitter<CardDragDropEvent>`   | Emitted when a card is moved (within or across columns)                   |
| `onColumnMoved` | `EventEmitter<ColumnDragDropEvent>` | Emitted when a column is reordered via drag and drop                      |
| `reachedEnd`    | `EventEmitter<ReachedEndEvent>`     | Triggered when the user scrolls to the bottom of a column (for lazy load) |

## Interfaces

### Board

Main container interface that represents the entire board structure. Used to define the overall board configuration including its columns and general styling.

```typescript
interface Board<T = any> {
	id?: number;
	title: string;
	description?: string;
	columns?: BoardColumn<T>[];
	classlist?: string[];
	style?: { [key: string]: any };
}
```

### BoardColumn

Represents a single column in the board. Used to configure individual columns, their cards, and column-specific behavior like drag-and-drop rules.

```typescript
interface BoardColumn<T = any> {
	id?: number;
	boardId?: number;
	title: string;
	description?: string;
	cards: BoardCard<T>[];
	style?: { [key: string]: any };
	classlist?: string[] | string;
	disabled?: boolean;
	cardSortingDisabled?: boolean;
}
```

### BoardCard

Represents individual cards within columns. Used to define card content and behavior, including custom data and styling.

```typescript
interface BoardCard<T = any> {
	id?: number;
	columnId?: number;
	title: string;
	description?: string;
	data?: T;
	classlist?: string[];
	style?: { [key: string]: any };
	disabled?: boolean;
}
```

### CardDragDropEvent

Event interface emitted when a card is moved. Provides all information about the drag-and-drop operation.

```typescript
interface CardDragDropEvent<T = any> {
	previousIndex: number;
	currentIndex: number;
	container: BoardDropContainer<BoardColumn>;
	previousContainer: BoardDropContainer<BoardColumn>;
	item: BoardDragItem<BoardCard>;
	isPointerOverContainer: boolean;
	distance?: { x: number; y: number };
	dropPoint?: { x: number; y: number };
}
```

### ColumnDragDropEvent

Event interface emitted when a column is moved. Provides all information about the column reordering operation.

```typescript
interface ColumnDragDropEvent {
	previousIndex: number;
	currentIndex: number;
	container: BoardDropContainer<BoardColumn[]>;
	previousContainer: BoardDropContainer<BoardColumn[]>;
	item: BoardDragItem<BoardColumn>;
	isPointerOverContainer: boolean;
	distance?: { x: number; y: number };
	dropPoint?: { x: number; y: number };
}
```

### DragBehavior

Type definition for controlling how dragged elements behave visually during drag operations.

```typescript
type DragBehavior = 'ghost' | 'hide' | 'collapse';
```

**Values:**

- `'ghost'`: Element becomes semi-transparent (50% opacity) but remains visible
- `'hide'`: Element is hidden but still occupies its space (invisible placeholder)
- `'collapse'`: Element is completely hidden and its space is collapsed (default)

## 🧩 Styling

`ng-hub-ui-board` is fully style-configurable through CSS custom properties.

For a complete and up-to-date token catalog, see [CSS Variables Reference](./docs/css-variables-reference.md).

### 🔗 Import styles

```scss
@use 'ng-hub-ui-board/src/lib/styles/board.scss';
```

### 🎛 Quick customization example (framework-agnostic)

```scss
.hub-board {
	--hub-board-columns-gap: 1.25rem;
	--hub-board-column-bg: #f8f9fa;
	--hub-board-card-bg: #ffffff;
	--hub-board-card-border-color: #d0d7de;
	--hub-board-placeholder-border-color: #0d6efd;
}
```

### 🔌 Bootstrap integration (optional)

```scss
.hub-board {
	--hub-board-column-bg: var(--bs-light);
	--hub-board-card-bg: var(--bs-body-bg);
	--hub-board-card-border-color: var(--bs-border-color);
	--hub-board-placeholder-border-color: var(--bs-primary);
}
```

## Real-world Use Cases

The `ng-hub-ui-board` component is versatile and has been used in a variety of real-world applications, such as:

- **Project Management Tools** – Visualize task progress across stages (To Do, In Progress, Done).
- **Support Ticket Boards** – Organize support tickets by urgency, team, or status.
- **Recruitment Pipelines** – Track candidates through different phases of hiring.
- **CRM Systems** – Manage leads and customers in pipeline-style workflows.
- **Editorial Calendars** – Schedule and organize content by publication status.

Each case benefits from customizable columns, card templates, and event outputs to integrate with your app logic.

## Troubleshooting

Here are some common issues and how to resolve them:

### 🔄 Drag and drop not working

- **Check dependencies**: Ensure `@angular/cdk` is installed and imported
- **Reactive data**: Verify your board data is reactive (using `signal()`, `Observable`, or proper change detection)
- **Browser compatibility**: Ensure your target browsers support the HTML5 Drag and Drop API

### 📏 Scroll detection not triggering `reachedEnd`

- **Height constraints**: The `<hub-board>` element or its parent must have a `max-height` or fixed height
- **Overflow setting**: Ensure `overflow: auto` or `overflow-y: scroll` is applied to enable scrolling
- **Content length**: Make sure there's enough content to actually trigger scrolling

### 🎨 Styles not applying

- **Import path**: Confirm you've imported the SCSS base styles in your global `styles.scss`:
    ```scss
    @use 'ng-hub-ui-board/src/lib/styles/base.scss';
    ```
- **CSS custom properties**: Check that your custom CSS variables follow the `--hub-*` naming convention
- **Style specificity**: Ensure your custom styles have sufficient specificity to override defaults

### 🧩 Templates not rendering

- **Import directives**: When using standalone components, import the template directives:
    ```typescript
    imports: [HubBoardComponent, CardTemplateDirective, BoardColumnHeaderDirective];
    ```
- **Template syntax**: Verify you're using the correct template selectors (`cardTpt`, `columnHeaderTpt`, `columnFooterTpt`)

### 🛠️ Runtime errors

- **"Cannot read property 'cards' of undefined"**: Initialize your board signal properly:
    ```typescript
    board = signal<Board>({ title: 'My Board', columns: [] });
    ```
- **Type errors**: Ensure your data matches the `Board`, `BoardColumn`, and `BoardCard` interfaces
- **Signal updates**: Use `.set()` or `.update()` methods to modify signal values

### 🎯 Performance issues

- **Large datasets**: Consider implementing virtual scrolling for columns with many cards
- **Memory leaks**: Ensure proper cleanup of event listeners and subscriptions
- **Change detection**: Use `OnPush` change detection strategy when possible

If problems persist, open an issue at: https://github.com/carlos-morcillo/ng-hub-ui-board/issues

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## Support the Project

If you find this project helpful and would like to support its development, you can buy me a coffee:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/carlosmorcillo)

Your support is greatly appreciated and helps maintain and improve this project!

## License

This project is licensed under the **Creative Commons Attribution 4.0 International License (CC BY 4.0)**.

### What this means:

✅ **You can:**

- Use commercially and non-commercially
- Modify, adapt, and create derivatives
- Distribute and redistribute in any format
- Use in private and public projects

📋 **You must:**

- Give appropriate credit to the original authors
- Provide a link to the license
- Indicate if changes were made

### Example attribution:

```
Based on ng-hub-ui-board by Carlos Morcillo
Original: https://github.com/carlos-morcillo/ng-hub-ui-board
License: CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)
```

For full license details, see the [LICENSE](LICENSE) file.

---

Made with ❤️ by [Carlos Morcillo Fernández](https://www.carlosmorcillo.com/)
