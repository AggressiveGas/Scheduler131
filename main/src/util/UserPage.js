import React, { useState, useEffect } from "react";
import { generateDate, months } from "./Calendar";
import cn from "./cn";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from "dayjs";

export default function UserPage() {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const currentDate = dayjs();
  const [today, setToday] = useState(currentDate);
  const [selectDate, setSelectDate] = useState(currentDate);
  const { userId } = useParams();

  const [joinCodes, setJoinCodes] = useState([]); //holds join codes
  const [meetings, setMeetings] = useState([]); //holds meetings

  useEffect(() => {
    const fetchUserRooms = async () => {
      try {
        const userTokenHere = localStorage.getItem("authToken");
        const response = await axios.get(`http://localhost:8080/api/user/${userId}/rooms`, {
          headers: {
            Authorization: `Bearer ${userTokenHere}`,
          },
        });

        const userJoinCodes = response.data.map(room => room.joincode);
        setJoinCodes(userJoinCodes);


        fetchMeetingsForDate(selectDate); 
      } catch (error) {
        console.error('Error fetching user rooms:', error.response?.data?.message || error.message);
      }
    };

    fetchUserRooms();
  }, [selectDate, userId]);

  useEffect(() => {
    fetchMeetingsForDate(selectDate);
  }, [selectDate, joinCodes]);

  const fetchMeetingsForDate = async (date) => {
    try {
      const userTokenHere = localStorage.getItem("authToken");
      const allMeetings = await Promise.all(
        joinCodes.map(async (joinCode) => {
          const response = await axios.get(`http://localhost:8080/api/meetings/${joinCode}`, {
            headers: {
              Authorization: `Bearer ${userTokenHere}`,
            },
            params: {
              date: date.format("YYYY-MM-DD"),
            },
          });
          return response.data.meetings; 
        })
      );

      
      const flatMeetings = [].concat(...allMeetings);

      setMeetings(flatMeetings || []);
    } catch (error) {
      console.error('Error fetching meetings:', error.response?.data?.message || error.message);
    }
  };


  //converting the meeting start and end times(because a normal user doesnt know what the 144 timeslots converts to lol):
  const convertTimeSlotToTime = (timeSlot) => {
	const totalMinutes = timeSlot * 10;
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
  
	//AM PM STUFFS
	const period = hours >= 12 ? 'PM' : 'AM';
	const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
	const formattedMinutes = String(minutes).padStart(2, '0');
  
	return `${formattedHours}:${formattedMinutes} ${period}`;
  };
  
  
  return (
    <div className="flex gap-10 sm:divide-x justify-center px-6 py-12 sm:w-1/2 mx-auto items-center sm:flex-row flex-col">
      <div className="w-96 h-96 ">
        <div className="flex justify-between items-center">
          <h1 className="select-none font-semibold">
            {months[today.month()]}, {today.year()}
          </h1>
          <div className="flex gap-10 items-center ">
            <GrFormPrevious
              className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
              onClick={() => {
                setToday(today.month(today.month() - 1));
              }}
            />
            <h1
              className=" cursor-pointer hover:scale-105 transition-all"
              onClick={() => {
                setToday(currentDate);
              }}
            >
              Today
            </h1>
            <GrFormNext
              className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
              onClick={() => {
                setToday(today.month(today.month() + 1));
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-7 ">
          {days.map((day, index) => {
            return (
              <h1
                key={index}
                className="text-sm text-center h-14 w-14 grid place-content-center text-gray-500 select-none"
              >
                {day}
              </h1>
            );
          })}
        </div>

        <div className=" grid grid-cols-7 ">
          {generateDate(today.month(), today.year()).map(({ date, currentMonth, today }, index) => {
            return (
              <div
                key={index}
                className="p-2 text-center h-14 grid place-content-center text-sm border-t"
              >
                <h1
                  className={cn(
                    currentMonth ? "" : "text-gray-400",
                    today ? "bg-red-600 text-white" : "",
                    selectDate.toDate().toDateString() === date.toDate().toDateString()
                      ? "bg-black text-white"
                      : "",
                    "h-10 w-10 rounded-full grid place-content-center hover:bg-black hover:text-white transition-all cursor-pointer select-none"
                  )}
                  onClick={() => {
                    setSelectDate(date);
                  }}
                >
                  {date.date()}
                </h1>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-96 w-96 sm:px-5">
        <h1 className="font-semibold">Schedule for {selectDate.toDate().toDateString()}</h1>
        {meetings.length > 0 ? (
          <ul>
            {meetings.map((meeting) => (
              <li key={meeting._id}>
				 <p>-------------------------------------</p>
				<p>You have a meeting scheduled on:</p>
				<p>Date: {meeting.day}</p>
                <p>Start Time: {convertTimeSlotToTime(meeting.start)}</p>
                <p>End Time: {convertTimeSlotToTime(meeting.end)}</p>
                <p>-------------------------------------</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No meetings for today.</p>
        )}
      </div>
    </div>
  );
}