import axios from "axios";
import { useState } from "react";
import { ChevronDown, ChevronUp, Edit, Trash2 } from "react-feather";
import { toast } from "react-toastify";

export default function List({
	tarefas,
	setTarefas,
	setOnEdit,
	getTarefas,
	toggleModal,
}) {
	const [draggingTask, setDraggingTask] = useState(null);

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm(
			"Você tem certeza que deseja excluir esta tarefa?"
		);
		if (!confirmDelete) return;

		try {
			const { data } = await axios.delete(
				`https://todolist-ffatto-backend.vercel.app/${id}`
			);
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
		toggleModal();
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
		<ul className="column flex flex-col items-center gap-5 w-full">
			{tarefas.map((tarefa, index) => {
				const isValue = tarefa.custo >= 1000;

				return (
					<li
						key={tarefa.idtarefas}
						className={`item border-l-4 rounded-lg cursor-pointer transition-all shadow-md duration-500 delay-[50ms] relative flex items-center justify-between w-full h-[116px] p-4 text-black bg-white ${
							isValue ? "border-[#E74C3C]" : "border-l-[#DB8A18]"
						}`}
						draggable="true"
						onDragStart={() => handleDragStart(index)}
						onDragEnd={handleDragEnd}
					>
						<div className="text-black flex items-start justify-start">
							<div className="drag mr-2">
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M11 18C11 19.1 10.1 20 9 20C7.9 20 7 19.1 7 18C7 16.9 7.9 16 9 16C10.1 16 11 16.9 11 18ZM9 10C7.9 10 7 10.9 7 12C7 13.1 7.9 14 9 14C10.1 14 11 13.1 11 12C11 10.9 10.1 10 9 10ZM9 4C7.9 4 7 4.9 7 6C7 7.1 7.9 8 9 8C10.1 8 11 7.1 11 6C11 4.9 10.1 4 9 4ZM15 8C16.1 8 17 7.1 17 6C17 4.9 16.1 4 15 4C13.9 4 13 4.9 13 6C13 7.1 13.9 8 15 8ZM15 10C13.9 10 13 10.9 13 12C13 13.1 13.9 14 15 14C16.1 14 17 13.1 17 12C17 10.9 16.1 10 15 10ZM15 16C13.9 16 13 16.9 13 18C13 19.1 13.9 20 15 20C16.1 20 17 19.1 17 18C17 16.9 16.1 16 15 16Z"
										fill="#919191"
									/>
								</svg>
							</div>
							<div className="flex flex-col items-start justify-center">
								<h4 className="font-bold">
									{tarefa.ordem}. {tarefa.nome}
								</h4>
								<p>
									{!isNaN(tarefa.custo) && tarefa.custo !== null
										? parseFloat(tarefa.custo).toLocaleString("pt-BR", {
												style: "currency",
												currency: "BRL",
										  })
										: "Sem custo"}
								</p>
								<h5 className="mt-3 flex gap-1">
									{tarefa.data && !isNaN(new Date(tarefa.data).getTime())
										? `${new Date(tarefa.data).toLocaleDateString("pt-BR")}`
										: "Sem data limite"}
								</h5>
							</div>
						</div>
						<div className="flex gap-2">
							<button
								onClick={() => handleEdit(tarefa)}
								className={`w-10 h-10 rounded-full flex items-center justify-center gap-1 hover:text-white ${
									isValue ? "hover:bg-[#E74C3C]" : "hover:bg-[#DB8A18]"
								}`}
							>
								<Edit />
							</button>
							<button
								onClick={() => handleDelete(tarefa.idtarefas)}
								className={`w-10 h-10 rounded-full flex items-center justify-center gap-1 hover:text-white ${
									isValue ? "hover:bg-[#E74C3C]" : "hover:bg-[#DB8A18]"
								}`}
							>
								<Trash2 />
							</button>
							<button
								onClick={() => handleMoveUp(index)}
								disabled={index === 0}
								className={`w-10 h-10 rounded-full flex items-center justify-center gap-1 hover:bg-[#DB8A18] hover:text-white ${
									index === 0 ? "invisible" : ""
								} ${isValue ? "hover:bg-[#E74C3C]" : "hover:bg-[#DB8A18]"}`}
							>
								<ChevronUp />
							</button>
							<button
								onClick={() => handleMoveDown(index)}
								disabled={index === tarefas.length - 1}
								className={`w-10 h-10 rounded-full flex items-center justify-center gap-1 hover:bg-[#DB8A18] hover:text-white ${
									index === tarefas.length - 1 ? "invisible" : ""
								} ${isValue ? "hover:bg-[#E74C3C]" : "hover:bg-[#DB8A18]"}`}
							>
								<ChevronDown />
							</button>
						</div>
					</li>
				);
			})}
		</ul>
	);
}
