import axios from "axios";

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
				`https://todolist-fatto-kappa.vercel.app/${onEdit.idtarefas}`,
				tarefaData
			);
			toast.success("Tarefa atualizada com sucesso!");
		} else {
			const response = await axios.get(
				"https://todolist-fatto-kappa.vercel.app"
			);
			const tarefasExistentes = response.data;

			tarefaData.ordem = tarefasExistentes.length + 1;

			await axios.post("https://todolist-fatto-kappa.vercel.app", tarefaData);
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

export default handleSubmit;
