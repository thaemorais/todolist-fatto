import express from "express";
import {
	deleteTarefas,
	getTarefas,
	setTarefas,
	updateTarefas,
} from "../controlers/tarefa.js";

const router = express.Router();

router.get("/", getTarefas);

router.post("/", setTarefas);

router.put("/:idtarefas", updateTarefas);

router.delete("/:idtarefas", deleteTarefas);

export default router;
