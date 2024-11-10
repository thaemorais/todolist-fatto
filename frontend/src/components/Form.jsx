import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { format } from "date-fns";

export default function Form({ onEdit, setOnEdit, getTarefas, toggleModal }) {
	const ref = useRef();
	const [selectedDate, setSelectedDate] = useState(null);

	useEffect(() => {
		if (onEdit) {
			const tarefa = ref.current;

			tarefa.nome.value = onEdit.nome;
			tarefa.custo.value = onEdit.custo;

			if (onEdit.data) {
				const parsedDate = new Date(onEdit.data);
				setSelectedDate(parsedDate);
			}
		}
	}, [onEdit]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const tarefa = ref.current;

		if (!tarefa.nome.value) {
			return toast.warn("Por favor, dê um nome à tarefa!");
		}

		const custo = parseFloat(tarefa.custo.value);

		let data = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;

		const tarefaData = {
			nome: tarefa.nome.value,
			custo,
			data,
			ordem: null,
		};

		try {
			if (onEdit) {
				await axios.put(
					`http://todolist-fatto.vercel.app/${onEdit.idtarefas}`,
					tarefaData
				);
				toast.success("Tarefa atualizada com sucesso!");
			} else {
				const response = await axios.get("http://todolist-fatto.vercel.app/");
				const tarefasExistentes = response.data;

				tarefaData.ordem = tarefasExistentes.length + 1;

				await axios.post("http://todolist-fatto.vercel.app/", tarefaData);
				toast.success("Tarefa adicionada com sucesso!");
			}
		} catch (error) {
			const errorMessage =
				error.response?.data || "Erro ao salvar a tarefa. Tente novamente.";
			toast.error(errorMessage);
		}

		tarefa.nome.value = "";
		tarefa.custo.value = "";
		setSelectedDate(null);

		setOnEdit(null);
		getTarefas();
		toggleModal();
	};

	return (
		<form
			className="flex flex-col items-center justify-start gap-2 w-full"
			ref={ref}
			onSubmit={handleSubmit}
		>
			<div className="flex flex-col justify-start items-start w-full">
				<label htmlFor="nome">Nome da tarefa*</label>
				<input
					name="nome"
					id="nome"
					type="text"
					placeholder="Levar a vó no jiu-jitsu"
					className="border-2 rounded-xl h-9 px-1 w-full"
					required
				/>
			</div>
			<div className="flex flex-col justify-start items-start w-full">
				<label htmlFor="custo">Custo</label>
				<input
					name="custo"
					type="number"
					step="0.01"
					placeholder="0.00"
					className="border-2 rounded-xl h-9 px-1 w-full"
				/>
			</div>
			<div className="flex flex-col justify-start items-start w-full">
				<label htmlFor="data">Data limite</label>
				<DatePicker
					selected={selectedDate}
					onChange={(date) => setSelectedDate(date)}
					dateFormat="dd/MM/yyyy"
					placeholderText="Selecione uma data"
					className="border-2 rounded-xl h-9 px-1 w-full"
					showPopperArrow={false}
					isClearable
				/>
			</div>
			<div className="flex items-center justify-end w-full gap-2">
				<button
					type="button"
					onClick={toggleModal}
					className="flex justify-center px-4 py-2 rounded-[100px] bg-white border border-[#DB8A18] text-base text-[#DB8A18]"
				>
					Cancelar
				</button>
				<button
					type="submit"
					className="flex justify-center px-4 py-2 rounded-[100px] bg-[#DB8A18] text-base text-white hover:bg-[#be5504]"
				>
					Salvar
				</button>
			</div>
		</form>
	);
}
