# ng-hub-ui-board

[![npm version](https://badge.fury.io/js/ng-hub-ui-board.svg)](https://badge.fury.io/js/ng-hub-ui-board)

## Part of ng-hub-ui Family
This component is part of the ng-hub-ui ecosystem, which includes:
- [ng-hub-ui-table](https://www.npmjs.com/package/ng-hub-ui-table)
- [ng-hub-ui-modal](https://www.npmjs.com/package/ng-hub-ui-modal)
- [ng-hub-ui-stepper](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [ng-hub-ui-breadcrumbs](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [ng-hub-ui-portal](https://www.npmjs.com/package/ng-hub-ui-portal)
- [ng-hub-ui-avatar](https://www.npmjs.com/package/ng-hub-ui-avatar)

## Description

A flexible and powerful board component for Angular applications, perfect for implementing Kanban-style boards, task management systems, or any drag-and-drop card-based interface. Similar to Trello boards, this component allows you to create interactive columns with draggable cards.

## Features

- 🎯 Standalone component
- 🔄 Drag and drop support for both cards and columns
- 📱 Responsive design
- 🎨 Highly customizable with templates
- 🔧 Bootstrap compatible
- ⚡ Virtual scrolling support with end-detection
- 🎭 Custom styling support for boards, columns, and cards
- 🔒 Disable/enable functionality for cards and columns

## Installation

```bash
# Install the component
npm install ng-hub-ui-board

# Install required peer dependency
npm install @angular/cdk
```

Or using yarn:

```bash
yarn add ng-hub-ui-board
yarn add @angular/cdk
```

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
  imports: [
    HubBoardComponent,
    CardTemplateDirective,
    BoardColumnHeaderDirective,
    BoardColumnFooterDirective
  ],
  template: `
    <hub-board
      [board]="board"
      (onCardClick)="handleCardClick($event)"
      (onCardMoved)="handleCardMoved($event)"
    >
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
  imports: [BoardModule],
  // ... rest of the module configuration
})
export class AppModule { }
```

## Templates

The component uses three different templates for customization. If you're using the standalone approach, remember to import the corresponding directives for each template you plan to use.

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

## Events

[Previous events documentation remains the same until reachedEnd]

### reachedEnd
Triggered when scrolling reaches the end of a column. To enable scrolling behavior, you must set a maximum height on the board component.

```html
<hub-board
  [board]="board"
  (reachedEnd)="handleReachedEnd($event)"
  style="max-height: 600px;">
  <!-- Templates -->
</hub-board>
```

```typescript
handleReachedEnd(event: ReachedEndEvent) {
  console.log('Reached end of column:', event.data.title);
  // Load more cards for this column
  this.loadMoreCards(event.index);
}
```

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
  predicate?: (item?: CdkDrag<T>) => boolean;
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

## Styling

The component uses BEM (Block Element Modifier) methodology for its CSS classes, making it easy to customize specific elements:

```scss
.hub-board { }
.hub-board__column-container {}
.hub-board__column { }
.hub-board__column-header { }
.hub-board__column-header-title { }
.hub-board__column-header-description { }
.hub-board__column-content { }
.hub-board__column-footer { }
.hub-board__card { }

// Modifiers
.hub-board__column--disabled { }
.hub-board__card--dragging { }
```

You can also apply custom styles through:
- CSS classes via `classlist` property
- Inline styles via `style` property
- Custom templates for complete visual control

You can apply styles at board, column, and card level:

```typescript
const board = {
  title: 'Styled Board',
  classlist: ['custom-board', 'shadow'],
  style: { backgroundColor: '#f5f5f5' },
  columns: [
    {
      title: 'Column 1',
      classlist: ['custom-column'],
      style: { minWidth: '300px' },
      cards: [
        {
          title: 'Card 1',
          classlist: ['custom-card', 'priority-high'],
          style: { borderLeft: '3px solid red' }
        }
      ]
    }
  ]
};
```

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## Support the Project

If you find this project helpful and would like to support its development, you can buy me a coffee:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/carlosmorcillo)

Your support is greatly appreciated and helps maintain and improve this project!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Carlos Morcillo Fernández](https://www.carlosmorcillo.com/)