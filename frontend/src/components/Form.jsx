import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { format } from "date-fns";

export default function Form({ onEdit, setOnEdit, getTarefas }) {
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
					`http://localhost:8800/${onEdit.idtarefas}`,
					tarefaData
				);
				toast.success("Tarefa atualizada com sucesso!");
			} else {
				const response = await axios.get("http://localhost:8800");
				const tarefasExistentes = response.data;

				tarefaData.ordem = tarefasExistentes.length + 1;

				await axios.post("http://localhost:8800", tarefaData);
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
	};

	return (
		<form
			className="flex items-end justify-center gap-2"
			ref={ref}
			onSubmit={handleSubmit}
		>
			<div className="flex flex-col justify-start items-start">
				<label htmlFor="nome">Nome da tarefa*</label>
				<input
					name="nome"
					id="nome"
					type="text"
					placeholder="Levar a vó no jiu-jitsu"
					className="border-2 rounded-sm h-9 px-1"
					required
				/>
			</div>
			<div className="flex flex-col justify-start items-start">
				<label htmlFor="custo">Custo (R$)</label>
				<input
					name="custo"
					type="number"
					step="0.01"
					placeholder="R$ 0,00"
					className="border-2 rounded-sm h-9 px-1"
				/>
			</div>
			<div className="flex flex-col justify-start items-start">
				<label htmlFor="data">Data limite</label>
				<DatePicker
					selected={selectedDate}
					onChange={(date) => setSelectedDate(date)}
					dateFormat="dd/MM/yyyy"
					placeholderText="Selecione uma data"
					className="border-2 rounded-sm h-9 px-1"
					showPopperArrow={false}
					isClearable
				/>
			</div>

			<button
				type="submit"
				className="flex justify-center px-2 py-2 rounded-md bg-[#5C9967] text-sm text-white hover:bg-lime-700"
			>
				+ Adicionar Tarefa
			</button>
		</form>
	);
}
