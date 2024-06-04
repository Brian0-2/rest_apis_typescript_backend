import { Sequelize } from "sequelize-typescript"
import dotenv from 'dotenv';
dotenv.config()

//__dirname es una funcion especial de node.js para especificar el archivo actual
const db = new Sequelize(process.env.DATABASE_URL!, {
    models: [__dirname + '/../Models/**/*'],
    logging: false
})

export default db;