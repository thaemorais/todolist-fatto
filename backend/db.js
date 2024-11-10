import mysql from "mysql2";

export const db = mysql.createConnection({
	host: "sql.freedb.tech",
	user: "freedb_thae_dev",
	password: "SJAZGsk$2YA?ym$",
	database: "freedb_todolistDB",
	port: 3306,
});
