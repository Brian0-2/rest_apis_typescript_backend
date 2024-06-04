import { exit } from 'process';
import db from '../config/db';

const clearDB = async ()=>{
    try {
        //Eliminar todos los datos de la base de datos con force que es una bandera o booleano para indicarle a la instancia de Sequelize que borre los datos
        await db.sync({force: true})
        console.log('Datos eliminados correctamente')
        exit(0);
    } catch (error) {
        console.log(error)
        //Finaliza con errores caso contrario finaliza bien
        exit(1);
    }
}

if(process.argv[2] === '--clear'){
    clearDB()
}