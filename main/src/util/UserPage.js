//This is the page in which the user will see, and it will show all user permisions and allow them to schedule
import dayjs from "dayjs";
import React, { useState } from "react";
import { generateDate, months } from "./Calendar";
import cn from "./cn";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useParams } from 'react-router-dom';
import axios from 'axios';



export default function UserPage() {
	
	const days = ["S", "M", "T", "W", "T", "F", "S"];
	const currentDate = dayjs();
	const [today, setToday] = useState(currentDate);
	const [selectDate, setSelectDate] = useState(currentDate);
	const { userId } = useParams();

    // Function to handle user deletion
    const handleDeleteUser = async () => {
        const userTokenHere = localStorage.getItem('authToken'); //gets token from localStorage

        try {
            const response = await axios.delete(`http://localhost:8080/api/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${userTokenHere}`
                }
            });
            
            console.log("User has been deleted");
        } catch (error) {
            console.error("Error deleting user: ", error);
        }
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
			{generateDate(today.month(), today.year()).map(
				({ date, currentMonth, today }, index) => {
				return (
					<div
					key={index}
					className="p-2 text-center h-14 grid place-content-center text-sm border-t"
					>
					<h1
						className={cn(
						currentMonth ? "" : "text-gray-400",
						today
							? "bg-red-600 text-white"
							: "",
						selectDate
							.toDate()
							.toDateString() ===
							date.toDate().toDateString()
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
				}
			)}
			</div>
		</div>
		
		<div className="h-96 w-96 sm:px-5">
			<h1 className=" font-semibold">
			Schedule for {selectDate.toDate().toDateString()}
			</h1>
            <p className="text-gray-400">No meetings for today.</p>
			<button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer"
          onClick={handleDeleteUser}
		  
        >
			
          Delete Account
        </button>
		</div>
	</div>
	);
}
