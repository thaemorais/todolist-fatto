import axios from "axios";
import { useState } from "react";
import { Calendar, ChevronDown, ChevronUp, Edit, Trash2 } from "react-feather";
import { toast } from "react-toastify";

export default function List({ tarefas, setTarefas, setOnEdit, getTarefas }) {
	const [draggingTask, setDraggingTask] = useState(null);

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm(
			"Você tem certeza que deseja excluir esta tarefa?"
		);
		if (!confirmDelete) return;

		try {
			const { data } = await axios.delete(`http://localhost:8800/${id}`);
			const newArray = tarefas.filter((tarefa) => tarefa.idtarefas !== id);
			setTarefas(newArray);
			toast.success(data);
			getTarefas();
		} catch (error) {
			const errorMessage = error.response?.data || "Erro ao excluir a tarefa.";
			toast.error(errorMessage);
		}
		setOnEdit(null);
	};

	const handleEdit = (item) => {
		setOnEdit(item);
	};

	const updateOrdens = (newTarefas) => {
		newTarefas.forEach((tarefa, index) => {
			tarefa.ordem = index + 1;
		});
		setTarefas(newTarefas);
	};

	const getNewPosition = (column, posY) => {
		const cards = column.querySelectorAll(".item:not(.dragging)");
		let result = null;
		for (let refer_card of cards) {
			const box = refer_card.getBoundingClientRect();
			const boxCenterY = box.y + box.height / 2;
			if (posY < boxCenterY) {
				result = refer_card;
				break;
			}
		}
		return result;
	};

	const handleDragStart = (index) => {
		setDraggingTask(index);
	};

	const handleDragEnd = (e) => {
		const column = e.target.closest(".column");
		const newPosition = getNewPosition(column, e.clientY);

		if (newPosition) {
			const newTarefas = [...tarefas];
			const draggedItem = newTarefas.splice(draggingTask, 1)[0];
			const newIndex = Array.from(column.children).indexOf(newPosition);

			newTarefas.splice(newIndex, 0, draggedItem);
			updateOrdens(newTarefas);
		}
		setDraggingTask(null);
	};

	const handleMoveUp = (index) => {
		if (index > 0) {
			const newTarefas = [...tarefas];
			const [movedTask] = newTarefas.splice(index, 1);
			newTarefas.splice(index - 1, 0, movedTask);
			updateOrdens(newTarefas);
		}
	};

	const handleMoveDown = (index) => {
		if (index < tarefas.length - 1) {
			const newTarefas = [...tarefas];
			const [movedTask] = newTarefas.splice(index, 1);
			newTarefas.splice(index + 1, 0, movedTask);
			updateOrdens(newTarefas);
		}
	};

	return (
		<ul className="column m-20 flex flex-col items-center gap-5 w-screen">
			{tarefas.map((tarefa, index) => {
				const isValue = tarefa.custo >= 1000;

				return (
					<li
						key={tarefa.idtarefas}
						className={`item cursor-pointer transition-all shadow-md duration-500 delay-[50ms] relative flex items-center justify-between w-[50%] h-[116px] p-4 text-[#4B332F] rounded-md ${
							isValue ? "bg-green-200" : "bg-[#F0D1A8]"
						}`}
						draggable="true"
						onDragStart={() => handleDragStart(index)}
						onDragEnd={handleDragEnd}
					>
						<div className="text-[#4B332F] flex flex-col items-start justify-between">
							<h4 className="font-bold">{tarefa.nome}</h4>
							<p>
								{!isNaN(tarefa.custo) && tarefa.custo !== null
									? parseFloat(tarefa.custo).toLocaleString("pt-BR", {
											style: "currency",
											currency: "BRL",
									  })
									: "Sem custo"}
							</p>
							<h5 className="mt-3 flex gap-1">
								<Calendar />
								{tarefa.data && !isNaN(new Date(tarefa.data).getTime())
									? `${new Date(tarefa.data).toLocaleDateString("pt-BR")}`
									: "Sem data limite"}
							</h5>
						</div>
						<div className="flex gap-2">
							<button
								onClick={() => handleEdit(tarefa)}
								className="flex items-center gap-1"
							>
								<Edit /> Editar
							</button>
							<button
								onClick={() => handleDelete(tarefa.idtarefas)}
								className="flex items-center gap-1"
							>
								<Trash2 /> Excluir
							</button>
							<button
								onClick={() => handleMoveUp(index)}
								disabled={index === 0}
								className={`flex items-center gap-1 ${
									index === 0 ? "invisible" : ""
								}`}
							>
								<ChevronUp /> Subir
							</button>
							<button
								onClick={() => handleMoveDown(index)}
								disabled={index === tarefas.length - 1}
								className={`flex items-center gap-1 ${
									index === tarefas.length - 1 ? "invisible" : ""
								}`}
							>
								<ChevronDown /> Descer
							</button>
						</div>

						<div className="absolute flex items-center justify-center left-[-20px] top-[-16px] bg-black rounded-full w-10 h-10">
							<p className="text-2xl text-white font-bold">{tarefa.ordem}</p>
						</div>
					</li>
				);
			})}
		</ul>
	);
}
