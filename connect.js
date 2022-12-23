import mysql from "mysql";

export const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password: "Badmanthings@567@",
    database: "social",
    
})