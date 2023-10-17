import { BoardColumn } from './board-column';

export interface Board<T = any> {
	id?: number;
	title: string;
	description?: string;
	color?: string;
	columns?: BoardColumn<T>[];
	classlist?: string[];
	style?: { [key: string]: any };
}
