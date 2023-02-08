// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Helper {
	export abstract class Dates {
		/**
		 * Format of data as set in service center.
		 */
		private static _serverFormat = '';

		/**
		 * Function that will compare 2 dates and check if date1 is older or equal to date2
		 *
		 * @static
		 * @param {string} date1 Date to be checked if older
		 * @param {string} date2 Date to be checked if it's after date1
		 * @return {*}  {boolean}
		 * @memberof Dates
		 */
		public static Compare(date1: string, date2: string): boolean {
			return Date.parse(date1) <= Date.parse(date2);
		}

		public static get ServerFormat(): string {
			return Dates._serverFormat;
		}

		/**
		 * Function used to check if a given date is an OutSystems nullDate
		 *
		 * @export
		 * @param {string} date
		 */
		public static IsNull(date: string | Date): boolean {
			let _date: Date;

			// Check if the given date is not a date object and if it's a valid date
			if (typeof date === 'string') {
				// Check if string could be parsed into a date - If it has an expected dateformat
				if (isNaN(Date.parse(date))) {
					throw new Error(`The given date '${date}' it's not a valid date.`);
				}
				_date = new Date(Date.parse(date));
			} else if (date instanceof Date) {
				//we received a date
				_date = date;
			} else {
				//we received a undefined or anything else
				return true;
			}

			// Check if is an OutSystems Null date
			if (_date.getFullYear() === 1900 && _date.getMonth() === 0 && _date.getDate() === 1) {
				return true;
			}

			return false;
		}

		/**
		 * Function responsible for setting up the the server date format.
		 *
		 * @export
		 * @param {string} date example of date.
		 */
		public static SetServerDateFormat(date: string): void {
			Dates._serverFormat = date.replace('13', 'DD').replace('10', 'MM').replace('1900', 'YYYY');
		}
	}
}