import dayjs from "dayjs";

export const generateDate = (
	month = dayjs().month(),
	year = dayjs().year(),
	meetings = []
  ) => {
	const firstDateOfMonth = dayjs().year(year).month(month).startOf("month");
	const lastDateOfMonth = dayjs().year(year).month(month).endOf("month");
  
	const arrayOfDate = [];
  
	// create prefix date
	for (let i = 0; i < firstDateOfMonth.day(); i++) {
	  const date = firstDateOfMonth.day(i);
  
	  arrayOfDate.push({
		currentMonth: false,
		date,
		hasMeeting: meetings.some(
		  (meeting) =>
			meeting.day === date.format("MM-DD-YYYY") // Assuming meeting.day is in MM-DD-YYYY format
		),
	  });
	}
  
	// generate current date
	for (let i = firstDateOfMonth.date(); i <= lastDateOfMonth.date(); i++) {
	  arrayOfDate.push({
		currentMonth: true,
		date: firstDateOfMonth.date(i),
		today:
		  firstDateOfMonth.date(i).toDate().toDateString() ===
		  dayjs().toDate().toDateString(),
		hasMeeting: meetings.some(
		  (meeting) =>
			meeting.day === firstDateOfMonth.date(i).format("MM-DD-YYYY")
		),
	  });
	}
  
	const remaining = 42 - arrayOfDate.length;
  
	for (
	  let i = lastDateOfMonth.date() + 1;
	  i <= lastDateOfMonth.date() + remaining;
	  i++
	) {
	  arrayOfDate.push({
		currentMonth: false,
		date: lastDateOfMonth.date(i),
		hasMeeting: meetings.some(
		  (meeting) =>
			meeting.day === lastDateOfMonth.date(i).format("MM-DD-YYYY")
		),
	  });
	}
	return arrayOfDate;
  };

export const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];