import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

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

		// Trata nome
		if (!tarefa.nome.value) {
			return toast.warn("Por favor, dê um nome à tarefa!");
		}

		// Trata custo
		let custo = tarefa.custo.value.trim();

		// Substitui a vírgula por ponto, se necessário
		custo = custo.replace(",", ".");

		// Verifica se o valor tem até 2 casas decimais
		if (!/^\d+(\.\d{1,2})?$/.test(custo)) {
			return toast.warn(
				"Por favor, insira um valor válido para o custo, com até 2 casas decimais!"
			);
		}

		const custoFloat = parseFloat(custo);

		// Verifica se o valor convertido é válido
		if (isNaN(custoFloat)) {
			return toast.warn("Por favor, insira um valor válido para o custo!");
		}

		// Trata data
		let data = selectedDate
			? new Date(selectedDate).toISOString().split("T")[0]
			: null;

		// Envia os dados
		const tarefaData = {
			nome: tarefa.nome.value,
			custo: custoFloat, // Envia o valor de custo com 2 casas decimais
			data,
		};

		try {
			if (onEdit) {
				// Manter a ordem original da tarefa ao editar
				tarefaData.ordem = onEdit.ordem;

				await axios.put(
					`https://todolist-fatto.vercel.app/${onEdit.idtarefas}`,
					tarefaData
				);
				toast.success("Tarefa atualizada com sucesso!");
			} else {
				// Para novas tarefas, calcular a ordem
				const response = await axios.get("https://todolist-fatto.vercel.app/");
				const tarefasExistentes = response.data;

				tarefaData.ordem = tarefasExistentes.length + 1;

				await axios.post("https://todolist-fatto.vercel.app/", tarefaData);
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
					type="text"
					step="0.01"
					placeholder="0,00"
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
			<div className="flex items-center justify-end w-full gap-2 mt-2">
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
