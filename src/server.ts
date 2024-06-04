import express from "express";
import colors from 'colors';
import cors, {CorsOptions} from 'cors';
import morgan from 'morgan';
import  SwaggerUi  from "swagger-ui-express";
import swaggerSpec, {swaggerUiOptions} from "./config/swagger";
import router from "./router";
import db from "./config/db";

//Conectar a base de datos
export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
    
        // console.log(colors.blue('Conexion exitosa a la db'))
       
    } catch (error) {
        // console.log(error)
        console.log(colors.red.bold('Hubo un error al conectar a la DB'))
    }
}

connectDB();
//Instancia de Express
const server = express();

//Permitir conexiones con cors
const corsOptions : CorsOptions = {
    origin: function(origin, callback) {
        if(origin === process.env.FRONTEND_URL){
            callback(null , true)
        }else{
            callback(new Error('Error CORS'))
        }

    }
}

server.use(cors(corsOptions))

//Leer datos del formulario
server.use(express.json());

//Morgan es un middleware para estar logeando todas las peticiones y interacciones del REST API
// example:
// Rest API en el puerto 4000
// POST /api/products 201 1507.621 ms - 137
server.use(morgan('dev'))

server.use('/api/products/',router)

//Docs
server.use('/docs',SwaggerUi.serve, SwaggerUi.setup(swaggerSpec, swaggerUiOptions))

export default server;