// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.SectionIndex {
	/**
	 *  Class that implements the SectionIndex pattern.
	 *
	 * @export
	 * @class SectionIndex
	 * @extends {AbstractPattern<SectionIndexConfig, SectionIndexItem.ISectionIndexItem>}
	 * @implements {ISectionIndex}
	 */
	export class SectionIndex
		extends AbstractParent<SectionIndexConfig, SectionIndexItem.ISectionIndexItem>
		implements ISectionIndex
	{
		// Store the current active sectionIndexItem
		private _activeSectionIndexItem: SectionIndexItem.ISectionIndexItem;
		// Store the contentPaddingTop
		private _contentPaddingTop: string | number;
		// Store the mainContent reference - The one that will have the scroll
		private _mainScrollContainerElement: HTMLElement;

		private _navigateOnClick = false;
		private _scrollTimeout: number;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new SectionIndexConfig(configs));
		}

		// Method to add Item to the list
		private _addSectionIndexItem(childItem: Patterns.SectionIndexItem.SectionIndexItem): void {
			if (this.getChild(childItem.uniqueId)) {
				throw new Error(
					`${ErrorCodes.SectionIndex.FailSetNewChildItem}: There is already a ${GlobalEnum.PatternName.SectionIndexItem} under Id: '${childItem.widgetId}' added to ${GlobalEnum.PatternName.SectionIndex} with uniqueId: ${this.uniqueId}.`
				);
			} else {
				// Store Child Item
				this.setChild(childItem);
			}
		}

		// Method to deal with the click at a SectionIndexItem
		private _childItemHasBeenClicked(childId: string): void {
			const childReference = this.getChild(childId);
			// Check if the given ChildId exist as an child item
			if (childReference) {
				// Update child status
				this._setActiveChildOnClick(childReference);
			} else {
				throw new Error(
					`${ErrorCodes.SectionIndex.FailChildItemClicked}: The ${GlobalEnum.PatternName.SectionIndexItem} under uniqueId: '${childId}' does not exist as an SectionIndexItem from ${GlobalEnum.PatternName.SectionIndex} with Id: ${this.widgetId}.`
				);
			}
		}

		private _getContentPaddingTop(): void {
			const _mainContent = Helper.Dom.ClassSelector(document, GlobalEnum.CssClassElements.MainContent);
			this._contentPaddingTop = _mainContent
				? parseFloat(
						window.getComputedStyle(_mainContent).getPropertyValue(GlobalEnum.CssProperties.PaddingTop)
					)
				: 0;
		}

		// Method used to remove a given SectionIndexItem from sectionIndexItems list, it's triggered by SectionIndexItem
		private _removeSectionIndexItem(childId: string): void {
			// Check if the given ChildId exist at childList
			if (this.getChild(childId)) {
				// Remove item
				this.unsetChild(childId);
			} else {
				throw new Error(
					`${ErrorCodes.SectionIndex.FailUnsetNewChildItem}: The ${GlobalEnum.PatternName.SectionIndexItem} under uniqueId: '${childId}' does not exist as an SectionIndexItem from ${GlobalEnum.PatternName.SectionIndex} with Id: ${this.widgetId}.`
				);
			}
		}

		// Method that will update the IsActive child item status
		private _setActiveChildOnClick(child: SectionIndexItem.ISectionIndexItem): void {
			// Clean the timeout
			this._navigateOnClick = true;
			window.clearTimeout(this._scrollTimeout);
			this._scrollTimeout = window.setTimeout(() => {
				// Reset flag in order to understand navigation by click has ended!
				this._navigateOnClick = false;
			}, 800); // enought time to deal with the scroll

			// Remove old sectionIndexItem as active if exist
			if (this._activeSectionIndexItem) {
				this._activeSectionIndexItem.unsetIsActive();
			}

			// Set new sectionIndexItem as active
			child.setIsActive();

			// Set the current IsActive Child
			this._activeSectionIndexItem = child;

			// Trigger the Scroll navigation
			Behaviors.Scroll(this._mainScrollContainerElement, child.TargetElementOffset, this.configs.SmoothScrolling);
		}

		// Method used to set the IsActive child item at the onBodyScroll
		private _setActiveChildOnScroll(child: SectionIndexItem.ISectionIndexItem) {
			// Prevent logic happen if the scroll has been triggered by click on the item
			if (this._navigateOnClick || this.configs.IsFixed === false) {
				return;
			}

			// Get all IsActive Items
			const isActiveChilds = this.getChildItems().filter((item) => item.IsSelected);
			// Go through all the IsActive items
			for (const optionItem of isActiveChilds) {
				// In case we've multiple IsActive items, unselect all unless last one!
				if (isActiveChilds.length === 1 || optionItem !== isActiveChilds[isActiveChilds.length - 1]) {
					this._activeSectionIndexItem.unsetIsActive();
				}
			}

			// Set new sectionIndexItem as active
			child.setIsActive();

			// Set the current IsActive Child
			this._activeSectionIndexItem = child;
		}

		// Method to set the SectionIndex IsFixed
		private _toggleIsFixed(): void {
			if (this.configs.IsFixed) {
				let headerHeight = 0;
				// Get Header height
				const hasFixedHeader = Helper.Dom.ClassSelector(
					document.body,
					GlobalEnum.CssClassElements.HeaderIsFixed
				);
				if (hasFixedHeader) {
					headerHeight =
						Helper.Dom.ClassSelector(document, GlobalEnum.CssClassElements.Header).offsetHeight || 0;
				}
				// Set inline css variable that will affect the pattern sticky position top value
				Helper.Dom.Styles.SetStyleAttribute(
					this.selfElement,
					Enum.CssVariable.TopPosition,
					'calc(' + headerHeight + 'px + ' + this._contentPaddingTop + 'px)'
				);

				// Set the Sticky class
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.IsSticky);
			} else {
				// Remove inline added css variable
				Helper.Dom.Styles.RemoveStyleAttribute(this.selfElement, Enum.CssVariable.TopPosition);
				// Remove the Sticky class
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.IsSticky);
			}
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.SectionIndex.SectionIndex
		 */
		protected setA11YProperties(): void {
			console.warn(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.SectionIndex.SectionIndex
		 */
		protected setCallbacks(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Method to set the HTMLElements used
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.SectionIndex.SectionIndex
		 */
		protected setHtmlElements(): void {
			// Check if overlay is enabled => If StatusBar is enabled and if is iOS device
			/* With the introduction of the ios-bounce the overflow container change from the .active-screen into .content */
			if (
				Helper.Dom.Attribute.Has(document.body, GlobalEnum.HTMLAttributes.StatusBar) &&
				Helper.DeviceInfo.GetOperatingSystem() === GlobalEnum.MobileOS.IOS
			) {
				this._mainScrollContainerElement = Helper.Dom.ClassSelector(
					document,
					GlobalEnum.CssClassElements.Content
				);
			} else {
				this._mainScrollContainerElement = Helper.Dom.ClassSelector(
					document,
					GlobalEnum.CssClassElements.ActiveScreen
				);
			}
		}

		/**
		 * This method has no implementation on this pattern context!
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.SectionIndex.SectionIndex
		 */
		protected unsetCallbacks(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Method to unset the HTMLElements used
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.SectionIndex.SectionIndex
		 */
		protected unsetHtmlElements(): void {
			this._mainScrollContainerElement = undefined;
		}

		/**
		 * Method used to be notified by a given ChildId about a given action and act accordingly
		 *
		 * @param childId Child Item Id to be stored/managed
		 * @param notifiedTo {Enum.ChildNotifyActionType} triggered notification type
		 * @memberof OSFramework.Patterns.SectionIndex.SectionIndex
		 */
		public beNotifiedByChild(
			childItem: Patterns.SectionIndexItem.SectionIndexItem,
			notifiedTo: Enum.ChildNotifyActionType
		): void {
			switch (notifiedTo) {
				case Enum.ChildNotifyActionType.Add:
					this._addSectionIndexItem(childItem);
					break;
				case Enum.ChildNotifyActionType.Click:
					this._childItemHasBeenClicked(childItem.uniqueId);
					break;
				case Enum.ChildNotifyActionType.Removed:
					this._removeSectionIndexItem(childItem.uniqueId);
					break;
				case Enum.ChildNotifyActionType.Active:
					this._setActiveChildOnScroll(this.getChild(childItem.uniqueId));
					break;
				default:
					throw new Error(
						`${ErrorCodes.SectionIndex.FailToSetChildItemAction}: There no exist a '${notifiedTo}' notification type.`
					);
			}
		}

		/**
		 * Method to build the SectionIndex.
		 *
		 * @memberof OSFramework.Patterns.SectionIndex.SectionIndex
		 */
		public build(): void {
			super.build();

			this.setHtmlElements();

			this._getContentPaddingTop();

			this._toggleIsFixed();

			this.finishBuild();
		}

		/**
		 * Applies the changes of state/value of the configurations.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof OSFramework.Patterns.SectionIndex.SectionIndex
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);
			if (this.isBuilt) {
				switch (propertyName) {
					case Enum.Properties.IsFixed:
						this._toggleIsFixed();
						break;
				}
			}
		}

		/**
		 * Disposes the current pattern.
		 *
		 * @memberof OSFramework.Patterns.SectionIndex.SectionIndex
		 */
		public dispose(): void {
			this.unsetHtmlElements();
			//Destroying the base of pattern
			super.dispose();
		}

		/**
		 * Getter of the contentPaddingTop property
		 *
		 * @readonly
		 * @type {(string | number)}
		 * @memberof SectionIndex
		 */
		public get contentPaddingTop(): string | number {
			return this._contentPaddingTop;
		}
	}
}
