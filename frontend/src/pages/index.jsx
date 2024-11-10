import { useEffect, useState } from "react";
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import axios from "axios";
import List from "./../components/List.jsx";
import Form from "./../components/Form.jsx";

export default function Home() {
	const [tarefas, setTarefas] = useState([]);
	const [onEdit, setOnEdit] = useState(null);

	useEffect(() => {
		getTarefas();
	}, [setTarefas]);

	const toggleModal = () => {
		const modal = document.getElementById("modalTarefa");
		if (modal.classList.contains("hidden")) {
			modal.classList.remove("hidden");
		} else {
			modal.classList.add("hidden");
		}
	};

	const getTarefas = async () => {
		try {
			const res = await axios.get("https://todolist-fatto.vercel.app/");
			setTarefas(res.data.sort((a, b) => a.ordem - b.ordem));
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<>
			<Navbar />
			<section className="mx-auto flex flex-col justify-center items-center text-center max-w-[1082px]">
				<div className="flex items-center justify-between w-full my-12">
					<div className="flex flex-col items-start justify-start">
						<h1 className="text-xl text-start">Olá!</h1>
						<h1 className="text-xl text-start">O que vamos fazer hoje?</h1>
					</div>
					<button
						data-modal-target="modalTarefa"
						data-modal-toggle="modalTarefa"
						type="button"
						onClick={toggleModal}
						className="flex justify-center px-4 py-2 rounded-[100px] bg-[#DB8A18] text-base text-white hover:bg-[#be5504]"
					>
						+ Nova tarefa
					</button>
				</div>
				<List
					tarefas={tarefas}
					setTarefas={setTarefas}
					setOnEdit={setOnEdit}
					getTarefas={getTarefas}
					toggleModal={toggleModal}
				/>
				<ToastContainer autoClose={3000} />
				<div
					id="modalTarefa"
					tabIndex="-1"
					aria-hidden="true"
					className="hidden fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
				>
					<div className="relative w-full max-w-[50%] p-6 bg-white rounded-lg shadow-lg">
						<div className="flex items-center justify-between pb-4 border-b">
							<h3 className="text-2xl font-semibold text-gray-900">
								Nova tarefa
							</h3>
							<button
								type="button"
								onClick={toggleModal}
								className="text-gray-400 hover:text-gray-900"
							>
								<svg
									width="25"
									height="25"
									viewBox="0 0 25 25"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M19.5 6.91L18.09 5.5L12.5 11.09L6.91 5.5L5.5 6.91L11.09 12.5L5.5 18.09L6.91 19.5L12.5 13.91L18.09 19.5L19.5 18.09L13.91 12.5L19.5 6.91Z"
										fill="#484848"
									/>
								</svg>
							</button>
						</div>

						<div className="py-6">
							<Form
								onEdit={onEdit}
								setOnEdit={setOnEdit}
								getTarefas={getTarefas}
								toggleModal={toggleModal}
							/>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
