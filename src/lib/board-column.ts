import { CdkDrag } from '@angular/cdk/drag-drop';
import { BoardCard } from './board-card';

/* The code is defining an interface called `BoardColumn` with generic type `T`. The interface has the following properties: */
export interface BoardColumn<T = any> {
	id?: number;
	index?: number;
	boardId?: number;
	title: string;
	description?: string;
	color?: string;
	cards: BoardCard<T>[];
	style?: any;
	classlist?: string[] | string;
	disabled?: boolean;
	data?: any;
	predicate?: (item?: CdkDrag<T>) => boolean;
}
