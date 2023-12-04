import React, { useState } from 'react';
import DateTimePicker from 'react-tailwindcss-datetimepicker';
import moment from 'moment-timezone';

function App() {
  const now = new Date();
  const start = moment(
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  );
  const end = moment(start).add(1, 'days').subtract(1, 'seconds');
  const [range, setRange] = useState({
    start: start,
    end: end,
  });
  const ranges = {
    Today: [moment(start), moment(end)],
    
  };
  const local = {
    format: 'DD-MM-YYYY HH:mm',
    sundayFirst: false,
  };
  const maxDate = moment(start).add(30, 'month');

  function handleApply(startDate, endDate) {
    setRange({ start: startDate, end: endDate });
  }

  return (
    <DateTimePicker
      ranges={ranges}
      start={range.start}
      end={range.end}
      local={local}
      maxDate={maxDate}
      applyCallback={handleApply}
    >
      <input
        placeholder="Enter date..."
        value={`${range.start.format(local.format)} - ${range.end.format(local.format)}`}
        disabled
      />
    </DateTimePicker>
  );
}

export default App;



