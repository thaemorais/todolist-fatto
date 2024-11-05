import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Form from "../components/Form";
import Navbar from "../components/Navbar";
import axios from "axios";
import List from "./../components/List.jsx";

export default function Home() {
	const [tarefas, setTarefas] = useState([]);
	const [onEdit, setOnEdit] = useState(null);

	const getTarefas = async () => {
		try {
			const res = await axios.get("http://localhost:8800");
			setTarefas(res.data.sort((a, b) => a.ordem - b.ordem));
		} catch (error) {
			toast.error(error);
		}
	};

	useEffect(() => {
		getTarefas();
	}, [setTarefas]);

	return (
		<>
			<Navbar />
			<div className="flex flex-col justify-center items-center text-center mt-5">
				<h1 className="text-2xl my-8">Olá! O que vamos fazer hoje?</h1>
				<Form onEdit={onEdit} setOnEdit={setOnEdit} getTarefas={getTarefas} />
				<List
					tarefas={tarefas}
					setTarefas={setTarefas}
					setOnEdit={setOnEdit}
					getTarefas={getTarefas}
				/>
				<Form onEdit={onEdit} setOnEdit={setOnEdit} getTarefas={getTarefas} />
			</div>
			<ToastContainer autoClose={3000} />
		</>
	);
}
