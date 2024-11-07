import express from "express";
import cors from "cors";
import tarefasRoutes from "./routes/tarefas.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.use("/", tarefasRoutes);

app.listen(port);
