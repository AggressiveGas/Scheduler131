import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link} from "react-router-dom";




export default function Register() {

	const navigate = useNavigate(); // useNavigate provides navigation functionality
	const [inputs, setInputs] = useState({
		name: "",
		email: "",
		password: "",
	});

	const handleChange = (e) => {
		setInputs((prev) => ({
		...prev,
		[e.target.name]: e.target.value,
		}));
	};

	const sendRequest = async () => {
		try {
			const res = await axios.post("http://localhost:8080/api/user/register", {
				name: inputs.name,
				email: inputs.email,
				password: inputs.password,
			});
			const data = res.data;
			return data;
		} catch (error) {
			throw new Error(error);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(inputs);
		//send http request
		try {
			const data = await sendRequest();
			// Navigate to login page after successful registration
			navigate('/login');
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
		{/*<img className="mx-auto h-10 w-auto" src= {logo} alt="Your Company"/>   ---for displaying the logo on the login page */}

		<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
				Register an account
				</h2>
			</div>

			<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
				<form className="space-y-6" onSubmit={handleSubmit} action="#" method="POST">
					<div>
						<label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
						Email address
						</label>
						<div className="mt-2">
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								className="block w-full rounded-md border-0 px-2.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								onChange={handleChange}
							/>
						</div>
					</div>

					<div>
						<div className="flex items-center justify-between">
							<label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
								Username
							</label>
						</div>
						<div className="mt-2">
							<input
								id="name"
								name="name"
								type="name"
								autoComplete="name"
								required
								className="block w-full rounded-md border-0 px-2.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								onChange={handleChange}
							/>
						</div>
					</div>

					<div>
						<div className="flex items-center justify-between">
							<label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
								Password
							</label>
						</div>
						<div className="mt-2">
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								className="block w-full rounded-md border-0 px-2.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								onChange={handleChange}
							/>
						</div>
					</div>

					<div>
						<button
						type="submit"
						className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
						Register 
						</button>
					</div>
				</form>

				<p className="mt-10 text-center text-sm text-gray-500">
					Already have an account?{' '}
					<Link to="/login" className="font-semibold leading-6 text-red-600 hover:text-indigo-500">
						Log in here
					</Link>
				</p>
			</div>
		</div>
		{/* 
		<footer>
			<div class="w-full mx-auto p-4 md:py-10">
				<hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
				<span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 Scheduler131™. All Rights Reserved.</span>
			</div>
	  	</footer>
		*/}
		</>
	)
}