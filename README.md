# ngx-board
A customizable Kanban-style board component built with Angular.
## Description
The ng80-board component provides a Kanban-style board that allows users to move cards between columns and reorder columns. The component uses the Angular CDK's drag and drop functionality to handle the card and column moves.

## Installation
To use the ng80-board component in your project, you need to install the @80ymedia/ng80-board package by running the following command in your project's root directory:

```sh
npm install ngx-board
```
After installing the package, you need to import the BoardModule in your app's module:

```typescript
import { BoardModule } from 'ngx-board';

@NgModule({
  imports: [
    BoardModule,
    // ...
  ],
  // ...
})
export class AppModule { }
```

## Usage
To use the ng80-board component in your template, add the ng80-board tag:

```html
<ng80-board 
	[board]="board"
  	(onCardMoved)="onCardMoved($event)"
  	(onCardClick)="onCardClick($event)"
    (onColumnMoved)="onColumnMoved($event)"
></ng80-board>
```

Where board is an object that conforms to the Board interface.

## Interfaces

### Board Interface

The `Board` interface represents a complete board. Its properties are:

- **id** (optional): unique number that identifies the board.
- **title**: title of the board (required).
- **description** (optional): description of the board.  
- **color** (optional): background color of the board.
- **columns** (optional): array of columns (typed as `BoardColumn[]`) on the board.
- **classlist** (optional): array of CSS classes for the board.
- **style** (optional): CSS styles object for the board.

### BoardColumn Interface 

The `BoardColumn` interface represents a column on a board. Its properties are:

- **id** (optional): unique number that identifies the column.
- **index** (optional): position of the column on the board.
- **boardId** (optional): id of the board the column belongs to.
- **title**: title of the column (required).
- **description** (optional): description of the column.
- **color** (optional): background color of the column.
- **cards**: array of cards (typed as `BoardCard[]`) in the column (required).
- **style** (optional): CSS styles object for the column.
- **classlist** (optional): array or string of CSS classes for the column.
- **disabled** (optional): boolean indicating if the column is disabled. 
- **data** (optional): any additional data to associate with the column.
- **predicate** (optional): function that returns a boolean to control if an item can be moved into the column.

### BoardCard Interface

- **id** (optional): unique number that identifies the card.
- **title**: title of the card (required).
- **description** (optional): description of the card.
- **data** (optional): any custom data to associate with the card.
- **classlist** (optional): array of CSS classes for the card.
- **style** (optional): CSS styles object for the card.


## Inputs
| Input | Description |
| ------ | ------ |
|board (required) | an instance of Board that defines the structure of the board|

## Outputs
| Output | Description |
| ------ | ------ |
| onCardMoved | emitted when a card is moved within or between columns on the board |
| onColumnMoved | emitted when a column is moved on the board.|
| onCardClick | emitted when a card is clicked.|
| reachedEnd | emitted when the user has scrolled to the end of a specific column in the board.|

Here are some usage examples for the BoardComponent outputs:

### Detect card click

```
<ng80-board [board]="board" (onCardClick)="cardClicked($event)">
</ng80-board>

// in component
cardClicked(card: BoardCard) {
  // do something when card is clicked
}
```

### Detect card move

```
<ng80-board 
  [board]="board"
  (onCardMoved)="cardMoved($event)"> 
</ng80-board>

// in component
cardMoved(event: CdkDragDrop<BoardColumn, BoardColumn, BoardCard<any>>) {
  // do something when card is moved
}
``` 

### Detect column move

```
<ng80-board
  [board]="board"
  (onColumnMoved)="columnMoved($event)">
</ng80-board>

// in component
columnMoved(event: CdkDragDrop<BoardColumn[]>) {
  // do something when column is moved  
}
```

### Detect scroll to column end

```
<ng80-board
  [board]="board" 
  (reachedEnd)="endReached($event)">
</ng80-board>

// in component
endReached(column: BoardColumn) {
  // load more cards when column end is reached
}
```

## Customization
The ng80-board component allows for customization of the card, column header, and column footer templates through the use of content projection.

To use a custom card template, create a ng-template element with the directive cardTemplate and place it within the ng80-board element. The content within this template will be used as the template for each card.

```html
<ng80-board [board]="board">
  <ng-template cardTemplate>
    <div class="custom-card-template">
      <h2>{{card.title}}</h2>
      <p>{{card.description}}</p>
    </div>
  </ng-template>
</ng80-board>
```
Similarly, custom templates for the column header and footer can be defined using the boardColumnHeader and boardColumnFooter directives respectively.

```html
<ng80-board [board]="board">
  <ng-template cardTpt let-item="item">
    <div class="custom-card-template">
      <h2>{{card.title}}</h2>
      <p>{{card.description}}</p>
    </div>
  </ng-template>
  <ng-template columnHeaderTpt let-column="column">
    <div class="custom-column-header">
      <h3>{{column.title}}</h3>
    </div>
  </ng-template>
  <ng-template columnFooterTpt let-column="column">
    <div class="custom-column-footer">
      <button>Add Card</button>
    </div>
  </ng-template>
</ng80-board>
```

## Support
If you find this library helpful and want to support its development, consider [buying me a coffee](https://www.buymeacoffee.com/carlosmorcillo). Thank you for your support!

## About the author
Carlos Morcillo is a web developer and open source contributor. You can find more of his work on [this website](https://www.carlosmorcillo.com/).