import { Sequelize } from "sequelize";

const db = new Sequelize('monisick_db', 'root', '',{
    host: "localhost",
    dialect: "mysql"
})

export default db;