import { moveItemInArray, transferArrayItem } from './drag-drop-event';

describe('Board Utils', () => {
	describe('moveItemInArray', () => {
		it('should move an item forward', () => {
			const array = [0, 1, 2, 3];
			moveItemInArray(array, 0, 2);
			expect(array).toEqual([1, 2, 0, 3]);
		});

		it('should move an item backward', () => {
			const array = [0, 1, 2, 3];
			moveItemInArray(array, 3, 1);
			expect(array).toEqual([0, 3, 1, 2]);
		});

		it('should handle indices out of bounds', () => {
			const array = [0, 1, 2, 3];
			moveItemInArray(array, 0, 10);
			expect(array).toEqual([1, 2, 3, 0]);

			moveItemInArray(array, 10, 0);
			expect(array).toEqual([0, 1, 2, 3]);
		});

		it('should do nothing if indices are the same', () => {
			const array = [0, 1, 2, 3];
			moveItemInArray(array, 1, 1);
			expect(array).toEqual([0, 1, 2, 3]);
		});
	});

	describe('transferArrayItem', () => {
		it('should transfer an item from one array to another', () => {
			const source = [1, 2, 3];
			const target = [4, 5, 6];
			transferArrayItem(source, target, 1, 1);
			expect(source).toEqual([1, 3]);
			expect(target).toEqual([4, 2, 5, 6]);
		});

		it('should handle indices out of bounds', () => {
			const source = [1, 2];
			const target = [3, 4];
			transferArrayItem(source, target, 10, 10);
			// Should take last item of source and append to target
			expect(source).toEqual([1]);
			expect(target).toEqual([3, 4, 2]);
		});

		it('should do nothing if source array is empty', () => {
			const source: any[] = [];
			const target = [1, 2];
			transferArrayItem(source, target, 0, 0);
			expect(source).toEqual([]);
			expect(target).toEqual([1, 2]);
		});
	});
});
