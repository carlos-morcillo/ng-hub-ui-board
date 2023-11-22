import { CdkDrag } from '@angular/cdk/drag-drop';
import { BoardCard } from './board-card';

/* The code is defining an interface called `BoardColumn` with generic type `T`. The interface has the following properties: */
export interface BoardColumn<T = any> {
	id?: number;
	boardId?: number;
	title: string;
	description?: string;
	cards: BoardCard<T>[];
	style?: { [key: string]: any };
	classlist?: string[] | string;
	disabled?: boolean;
	data?: any;
	cardSortingDisabled?: boolean;
	predicate?: (item?: CdkDrag<T>) => boolean;
}
