$A.bind(window, 'load', function(){

	// Syntax : setCalendar( ID , TriggeringElement , TargetEditField , EnableComments , clickHandler , config )

	$A.setCalendar('UniqueCalendarId', $A.getEl('dateIcon'), $A.getEl('date'), false, function(ev, dc, targ){

		// Save the desired date string
		// Format: mm/dd/yyyy
		targ.value = ('0' + (dc.range.current.month + 1)).slice(-2) + '/' + ('0' + dc.range.current.mDay).slice(-2) + '/'
			+ dc.range.current.year;

		// Or variable
		/*
				targ.value = dc.range.wDays[dc.range.current.wDay].lng + ' ' + dc.range[dc.range.current.month].name + ' '
					+ dc.range.current.mDay + ', ' + dc.range.current.year;
		*/

		// Then close the date picker
		dc.close();
	},
					{

					// Configure optional overrides

					// Configure flexible disabled date ranges
					ajax: function(dc, save){

						// Run before the datepicker renders

						// Set current date variables
						var date = new Date(), current =
										{
										day: date.getDate(),
										month: date.getMonth(),
										year: date.getFullYear(),
										weekDay: date.getDay()
										};

						// Disable all dates prior to the current day
						if (current.year > dc.range.current.year
							|| (current.year === dc.range.current.year && current.month > dc.range.current.month)){
							dc.range[dc.range.current.month].disabled[dc.range.current.year] =
								[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
									31];
						}

						if (current.year === dc.range.current.year && current.month === dc.range.current.month){
							dc.range[dc.range.current.month].disabled[dc.range.current.year] = [];

							for (var day = 1; day < current.day; day++){
								dc.range[dc.range.current.month].disabled[dc.range.current.year].push(day);
							}
						}

						// Disable all dates that fall on Saturday or Sunday
						if (!dc.range[dc.range.current.month].disabled[dc.range.current.year])
							dc.range[dc.range.current.month].disabled[dc.range.current.year] = [];
						date.setFullYear(dc.range.current.year);
						date.setMonth(dc.range.current.month);
						var max = dc.range[dc.range.current.month].max;

						if (dc.range.current.month === 1)
							max = (new Date(dc.range.current.year, 1, 29).getMonth() == 1) ? 29 : 28;

						for (var day = 1; day <= max; day++){
							date.setDate(day);
							var weekDay = date.getDay();

							// 0 = Sunday, 6 = Saturday
							if (weekDay === 0 || weekDay === 6)
								dc.range[dc.range.current.month].disabled[dc.range.current.year].push(day);
						}

						// Disable Halloween for every year
						if (dc.range.current.month == 9){
							if (!dc.range[dc.range.current.month].disabled[dc.range.current.year])
								dc.range[dc.range.current.month].disabled[dc.range.current.year] = [];
							dc.range[dc.range.current.month].disabled[dc.range.current.year].push(31);
						}

						// Now render the datepicker after configuring the disabled date ranges
						dc.open();
					},

					// If not included, all of the below values are set by default

					// Set role name text for screen reader users
					role: 'Calendar',

					// Set tooltip text
					tooltipTxt: 'Press Escape to cancel',
					disabledTxt: 'Disabled',
					commentedTxt: 'Has Comment',
					prevTxt: 'Previous',
					nextTxt: 'Next',
					monthTxt: 'Month',
					yearTxt: 'Year',

					// Set month names
					months:
									[
									'January',
									'February',
									'March',
									'April',
									'May',
									'June',
									'July',
									'August',
									'September',
									'October',
									'November',
									'December'
									],

					// Set short and long weekday names
					days:
									[
									{
									s: 'S',
									l: 'Sunday'
									},
									{
									s: 'M',
									l: 'Monday'
									},
									{
									s: 'T',
									l: 'Tuesday'
									},
									{
									s: 'W',
									l: 'Wednesday'
									},
									{
									s: 'T',
									l: 'Thursday'
									},
									{
									s: 'F',
									l: 'Friday'
									},
									{
									s: 'S',
									l: 'Saturday'
									}
									],

					// Set positive or negative offset for differing column arrangements, or 0 for none
					wdOffset: 0,

					// Set CSS positioning calculation for the calendar
					autoPosition: 3,
					// Customize with positive or negative offsets
					offsetTop: 0,
					offsetLeft: 5,
					// Set class for the calendar container
					className: 'calendar',

// Choose a different insertion point in the DOM; must be a DOM node; defaults to the triggering element if not specified.
					targetObj: null,

// Choose a different focus element in the DOM for CSS autoPositioning; may be a DOM node or CSS Selector; defaults to the triggering element if not specified.
					posAnchor: ''
					});
});