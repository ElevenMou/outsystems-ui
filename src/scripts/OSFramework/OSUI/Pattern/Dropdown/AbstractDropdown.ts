// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Dropdown {
	export abstract class AbstractDropdown<P, C extends AbstractDropdownConfig>
		extends AbstractProviderPattern<P, C>
		implements IDropdown
	{
		// Close and Open setTimeout value time
		protected _setTimeOutOpenCloseVal = 100;

		/**
		 * Creates an instance of AbstractDropdown.
		 *
		 * @param {string} uniqueId
		 * @param {C} configs
		 * @memberof AbstractDropdown
		 */
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		// Common methods that all Dropdowns must implement!
		public abstract clear(): void;
		public abstract close(): void;
		public abstract disable(): void;
		public abstract enable(): void;
		public abstract getSelectedValues(): string;
		public abstract open(): void;
		public abstract validation(isValid: boolean, validationMessage: string): void;
	}
}
