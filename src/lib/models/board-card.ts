/**
 * Represents a card within a board column, containing the core data and behavior.
 * 
 * @template T The type of custom data attached to the card (defaults to `any`).
 */
export interface BoardCard<T = any> {
	/**
	 * Unique identifier for the card.
	 */
	id?: number;

	/**
	 * The identifier of the column this card belongs to.
	 */
	columnId?: number;

	/**
	 * The main title displayed on the card.
	 */
	title: string;

	/**
	 * Optional description providing additional details about the card.
	 */
	description?: string;

	/**
	 * Custom data that can be attached to this card, such as metadata, 
	 * priority levels, due dates, or any application-specific information.
	 */
	data?: T;

	/**
	 * Optional list of CSS classes to apply to the card for custom styling.
	 */
	classlist?: string[];

	/**
	 * Custom inline styles for the card, represented as a key-value mapping.
	 */
	style?: { [key: string]: any };

	/**
	 * If true, the card is disabled and cannot be interacted with (e.g., dragged or clicked).
	 */
	disabled?: boolean;
}
