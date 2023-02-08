// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Dropdown.VirtualSelect.Tags {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIVirtualSelectTags extends AbstractVirtualSelect<VirtualSelectTagsConfig> {
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new VirtualSelectTagsConfig(configs));
		}

		/**
		 * Get the selected values options that will be used to pass into platform as a JSON string
		 *
		 * @protected
		 * @return {*}  {DropDownOption[]}
		 * @memberof OSUIVirtualSelectTags
		 */
		protected getSelectedOptionsStructure(): DropDownOption[] {
			// Store the options selected
			const optionsSelected = this._virtualselectConfigs.getSelectedOptions();

			return optionsSelected;
		}

		/**
		 * Method that will set the provider configurations in order to properly create its instance
		 *
		 * @protected
		 * @memberof OSUIVirtualSelectTags
		 */
		protected prepareConfigs(): void {
			// Get the library configurations
			this._virtualselectOpts = this.configs.getProviderConfig();

			// Instance will be Created!
			this.createProviderInstance();
		}
	}
}