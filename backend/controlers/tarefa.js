import { db } from "../db.js";

export const setTarefas = async (req, res) => {
	const nome = req.body.nome;

	const checkQuery = "SELECT * FROM tarefas WHERE `nome` = ?";
	db.query(checkQuery, [nome], (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).json("Erro ao verificar a tarefa existente.");
		}

		if (results.length > 0) {
			return res.status(400).json("Já existe uma tarefa com esse nome.");
		}

		const q = "INSERT INTO tarefas(`nome`, `custo`, `data`, `ordem`) VALUES(?)";
		const values = [nome, req.body.custo, req.body.data, req.body.ordem];

		db.query(q, [values], (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json("Erro ao criar a tarefa.");
			}

			return res.status(200).json("Tarefa criada com sucesso!");
		});
	});
};

export const getTarefas = (_, res) => {
	const q = "SELECT * FROM tarefas ORDER BY `ordem`";

	db.query(q, (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).json("Erro ao buscar as tarefas.");
		}

		return res.status(200).json(data);
	});
};

export const updateTarefas = (req, res) => {
	const { nome, custo, data } = req.body;
	const { idtarefas } = req.params;

	const checkQuery =
		"SELECT * FROM tarefas WHERE `nome` = ? AND `idtarefas` != ?";
	db.query(checkQuery, [nome, idtarefas], (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).json("Erro ao verificar a tarefa existente.");
		}

		if (results.length > 0) {
			return res.status(400).json("Já existe uma tarefa com esse nome.");
		}

		const q =
			"UPDATE tarefas SET `nome` = ?, `custo` = ?, `data` = ? WHERE `idtarefas` = ?";
		const values = [nome, custo, data];

		db.query(q, [...values, idtarefas], (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json("Erro ao atualizar a tarefa.");
			}

			return res.status(200).json("Tarefa atualizada com sucesso!");
		});
	});
};

export const deleteTarefas = (req, res) => {
	const q = "DELETE FROM tarefas WHERE `idtarefas` = ?";

	db.query(q, [req.params.idtarefas], (err) => {
		if (err) {
			console.error(err);
			return res.status(500).json("Erro ao deletar a tarefa.");
		}

		const initializeQuery = "SET @rownum := 0";
		const updateOrderQuery = `
			UPDATE tarefas 
			SET ordem = (@rownum := @rownum + 1)
			ORDER BY ordem;
		`;

		db.query(initializeQuery, (err) => {
			if (err) {
				console.error(err);
				return res.status(500).json("Erro ao inicializar a variável.");
			}

			db.query(updateOrderQuery, (err) => {
				if (err) {
					console.error(err);
					return res
						.status(500)
						.json("Erro ao atualizar as ordens das tarefas.");
				}

				return res.status(200).json("Tarefa excluída com sucesso!");
			});
		});
	});
};
